import express from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';
import { PDFLoader } from '@langchain/community/document_loaders/fs/pdf';
import { ChatOllama } from '@langchain/community/chat_models/ollama';
import { StringOutputParser } from '@langchain/core/output_parsers';
import { PromptTemplate } from '@langchain/core/prompts';
import { FaissStore } from '@langchain/community/vectorstores/faiss';
import { OllamaEmbeddings } from '@langchain/community/embeddings/ollama';
import { RetrievalQAChain } from 'langchain/chains';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { Chroma } from '@langchain/community/vectorstores/chroma';
import { HNSWLib } from '@langchain/community/vectorstores/hnswlib';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());
const upload = multer({ dest: 'uploads/' });

let vectorStoreRetriever = null;

// Endpoint to upload PDF
app.post('/upload', upload.single('pdf'), async (req, res) => {
  try {
    console.log('Received PDF upload request');
    const filePath = path.join(__dirname, req.file.path);
    console.log(`PDF saved at ${filePath}`);

    const loader = new PDFLoader(filePath);
    console.log('Loading PDF');
    const docs = await loader.load();
    console.log('PDF loaded successfully');

    const textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 200,
    });
    console.log('Splitting PDF into chunks');
    const splitDocs = await textSplitter.splitDocuments(docs);
    console.log('PDF split into chunks successfully');

    const embeddings = new OllamaEmbeddings({
      model: 'nomic-embed-text',
    });
    console.log('Generating embeddings');
    const vectorStore = await HNSWLib.fromDocuments(splitDocs, embeddings);
    console.log('Embeddings generated and vector store created');

    vectorStoreRetriever = vectorStore.asRetriever();
    console.log('Vector store retriever set');

    res.send({ message: 'PDF processed and ready for queries.' });
  } catch (error) {
    console.error('Error processing PDF:', error);
    res.status(500).send({ error: error.message });
  }
});

// Endpoint to ask question
app.post('/ask', async (req, res) => {
  const { question } = req.body;

  console.log('Received question:', question);

  if (!vectorStoreRetriever) {
    console.error('No PDF uploaded and processed');
    return res.status(400).send({ error: 'No PDF uploaded and processed.' });
  }

  const model = new ChatOllama({
    model: 'llama3',
  });
  console.log('Initialized ChatOllama model');

  const promptTemplate = new PromptTemplate({
    template: `Based on the given context, please answer the question: if you don't know the answer then say so don't make up an answer\n\n{{context}}\n\nQuestion: {{query}}\n\nAnswer:`,
    inputVariables: ['context', 'query'],
  });
  console.log('Created prompt template');

  const chain = RetrievalQAChain.fromLLM(model, vectorStoreRetriever, {
    promptTemplate: promptTemplate,
  });
  console.log('Created RetrievalQAChain');

  try {
    const answer = await chain.invoke({
      query: question,
    });
    console.log('Generated answer:', answer);
    res.send({ answer });
  } catch (error) {
    console.error('Error generating answer:', error);
    res.status(500).send({ error: error.message });
  }
});

app.listen(5000, () => {
  console.log('Server running on http://localhost:5000');
});
