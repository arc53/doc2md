import { FormEvent, useState } from "react";

import CheckMark from "@/assets/check.svg";
import Copy from "@/assets/content_copy.svg";
import Markdown from "@/assets/markdown.svg";
import UploadFile from "@/assets/upload_file.svg";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { DocsGPTWidget } from "docsgpt";

import { useTheme } from "../ThemeContext";

export default function DocumentToMarkdown() {
  const { isDarkTheme } = useTheme();
  const [markdown, setMarkdown] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [copySuccess, setCopySuccess] = useState(false);

  const buttonVariant = isDarkTheme ? "secondary" : "default";

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const fileInput = (event.target as HTMLFormElement).elements.namedItem(
      "file"
    ) as HTMLInputElement;
    const formData = new FormData();
    if (fileInput.files && fileInput.files.length > 0) {
      formData.append("file", fileInput.files[0]);
    }
    try {
      setIsLoading(true);
      const response = await fetch("https://llm.arc53.com/doc2md", {
        method: "POST",
        body: formData,
      });
      if (!response.ok) {
        throw new Error("Failed to upload file");
      }
      const data = await response.json();
      setMarkdown(data.markdown);
      setErrorMessage("");
      setIsLoading(false);
    } catch (error: unknown) {
      console.error("Error:", error);
      setErrorMessage(error instanceof Error ? error.message : "");
      setTimeout(() => {
        setErrorMessage("");
      }, 3000);
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    if (markdown) {
      navigator.clipboard.writeText(markdown).then(
        () => {
          setCopySuccess(true);
          setTimeout(() => {
            setCopySuccess(false);
          }, 2000);
        },
        () => {
          setCopySuccess(false);
        }
      );
    }
  };
  return (
    <div className="p-6 mx-auto flex md:flex-row flex-col items-center gap-10">
      <div className="md:w-1/2 py-4">
        <h1 className="scroll-m-20 text-3xl font-extrabold tracking-tight lg:text-4xl">
          Documents to Markdown
        </h1>
        <h2 className="leading-7 mt-2 mb-12 text-xl text-[#1E1E1E] dark:text-[#FDFDFD]">
          Convert PDFs and Images into structured Markdown
        </h2>
        <div className="flex items-center mb-3 gap-1">
          <img className="filter dark:invert" src={UploadFile} />
          <h1 className="text-lg font-bold">Upload PDF or Image File</h1>
        </div>
        <form
          onSubmit={handleSubmit}
          className="space-y-4 border p-4 rounded-md"
        >
          <input
            type="file"
            name="file"
            accept=".pdf, .png, .jpg, .jpeg"
            className="block w-full pt-2 pb-4 border-b"
            required
          />
          <Button type="submit" variant={buttonVariant} className="w-28">
            {isLoading ? <Spinner size={16} /> : "Convert"}
          </Button>
        </form>
        <div
          className={`mt-4 text-red-600 font-medium transition-opacity duration-500 ${
            errorMessage ? "opacity-100" : "opacity-0"
          }`}
        >
          {errorMessage}
        </div>
      </div>
      <div className="w-full md:w-1/2 border py-4 rounded-xl">
        <div className="flex items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <img className="filter dark:invert" src={Markdown} />
            <h2 className="text-lg font-semibold">Output</h2>
          </div>
          {markdown && (
            <button className="relative h-6 w-6" onClick={handleCopy}>
              <img
                className={`filter dark:invert transition-opacity duration-300 ${
                  copySuccess ? "opacity-0" : "opacity-100"
                }`}
                src={Copy}
                alt="Copy"
              />
              <img
                className={`absolute top-0 right-0 dark:invert transition-opacity duration-300 ${
                  copySuccess ? "opacity-100" : "opacity-0"
                }`}
                src={CheckMark}
                alt="Checkmark"
              />
            </button>
          )}
        </div>
        <div
          className={`backdrop-blur-lg bg-background/95 h-[50vh] md:h-[75vh] mt-4 p-4 border-t whitespace-pre-wrap overflow-y-auto ${
            !markdown ? "italic text-[#000000]/80 dark:text-[#ffffff]/50" : ""
          }`}
        >
          {isLoading ? (
            <div className="space-y-4 animate-pulse">
              {Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="space-y-2">
                  <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded-md"></div>
                  <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded-md"></div>
                  <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded-md w-3/4"></div>
                  <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded-md w-1/2"></div>
                </div>
              ))}
            </div>
          ) : (
            markdown || "Your markdown output will appear here.."
          )}
        </div>
      </div>
      <DocsGPTWidget apiKey="ed775f46-a2fc-40c0-9a4d-8de189d5327e"
      description="Ask your questions about Doc2MD"
      heroTitle = "Welcome to Doc2MD!" />
    </div>
  );
}
