import { ChatOllama } from "@langchain/community/chat_models/ollama";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { PromptTemplate } from "@langchain/core/prompts";
import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import { FaissStore } from "@langchain/community/vectorstores/faiss";
import { NomicEmbeddings } from "@langchain/nomic";

 
const nomicEmbeddings = new NomicEmbeddings();
 
const model = new ChatOllama({
  baseUrl: "http://localhost:11434", // Default value
  model: "llama3", // Default value
});
 
const promptTemplate = `
Instruction: Answer the question based on the following context:
${context}
Question:
${question}
`;
 
prompt = PromptTemplate(
    inputVariables=["context", "question"],
    template=promptTemplate,
)
 
const chain = RunnableSequence.from([promptTemplate, model]);
 
const loader = new PDFLoader("C:/Users/tushar.kant/Downloads/2023-Sales-Trends-Report_Global.pdf");
const docs = await loader.load();
 
const textSplitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 200,
  });
const splitDocs = await textSplitter.splitDocuments(docs);


  const vectorStore = await FaissStore.fromDocuments(
    splitDocs,
    nomicEmbeddings
  );
 
  retriever=vectorStore.asRetriever();

  const retrievalChain = RunnableSequence.from([
    {
      context: retriever,
      question: new RunnablePassthrough(),
    },
    chain
  ]);

  const stream = await retrievalChain.stream(
    "What are the top sales challenges?"
  );
  
  for await (const chunk of stream) {
    console.log(`${chunk}|`);
  }
  
  