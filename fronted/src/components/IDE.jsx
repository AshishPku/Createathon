import { useState, useRef, useEffect } from "react";
import Editor from "@monaco-editor/react";
import Split from "react-split";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Play, Share2, Check, AlertCircle } from "lucide-react";
import { useParams } from "react-router-dom";
import axios from "axios";

const languages = [
  { value: "javascript", label: "JavaScript" },
  { value: "typescript", label: "TypeScript" },
  { value: "python", label: "Python" },
  { value: "java", label: "Java" },
  { value: "cpp", label: "C++" },
];

const defaultCode = {
  javascript: `// Write your JavaScript code here\nfor (let i = 0; i < 100; i++) {console.log("Hare Krishna");}\n`,
  typescript: `// Write your TypeScript code here\nfunction solution(): string {\n  return "";\n}\n`,
  python: `# Write your Python code here\ndef solution():\n    return ""\n`,
  java: `// Write your Java code here\npublic class Main {\n    public static void main(String[] args) {\n        // Your solution here\n    }\n}\n`,
  cpp: `// Write your C++ code here\n#include <iostream>\nint main() {\n    // Your solution here\n    return 0;\n}\n`,
};

const IDE = () => {
  const { id } = useParams();
  const [language, setLanguage] = useState("javascript");
  const [code, setCode] = useState(defaultCode.javascript);
  const [output, setOutput] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionStatus, setSubmissionStatus] = useState(null);
  const [problem, setProblem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const editorRef = useRef(null);
  const [activeTab, setActiveTab] = useState("problem");

  useEffect(() => {
    const fetchQuestion = async () => {
      try {
        const response = await axios.get(
          `http://127.0.0.1:8000/api/auth/questions/${id}/`
        );
        setProblem({
          title: response.data.title,
          description: response.data.description,
          difficulty:
            response.data.difficulty_display || response.data.difficulties,
          examples: [
            { input: "Example input 1", output: "Example output 1" },
            { input: "Example input 2", output: "Example output 2" },
          ],
        });
      } catch (err) {
        console.error("Error fetching question:", err);
        setError("Failed to load question. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchQuestion();
  }, [id]);

  const handleEditorDidMount = (editor) => {
    editorRef.current = editor;
  };

  const handleLanguageChange = (value) => {
    setLanguage(value);
    setCode(defaultCode[value]);
    setOutput("");
  };

  const runCode = () => {
    setIsRunning(true);
    setOutput("");
    setActiveTab("output");

    setTimeout(() => {
      if (language === "javascript") {
        try {
          const originalConsoleLog = console.log;
          const logs = [];
          console.log = (...args) => logs.push(args.join(" "));

          try {
            const func = new Function(code);
            func();
            setOutput(logs.join("\n"));
          } catch (error) {
            setOutput(`Error: ${error.message}`);
          }

          console.log = originalConsoleLog;
        } catch (error) {
          setOutput(`Error: ${error.message}`);
        }
      } else {
        setOutput(`To execute ${language} code, we need a backend service.`);
      }

      setIsRunning(false);
    }, 1000);
  };

  const submitCode = async () => {
    setIsSubmitting(true);
    setSubmissionStatus(null);
    setActiveTab("output");

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/auth/submissions/",
        {
          question_id: id,
          code: code,
          languages: language,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access")}`,
            "Content-Type": "application/json",
          },
        }
      );

      setSubmissionStatus({
        type: "success",
        message: "Code submitted successfully!",
      });
      setOutput(
        "Submission received. Status: " + response.data.submission.status
      );
    } catch (error) {
      setSubmissionStatus({
        type: "error",
        message: error.response?.data?.message || "Failed to submit code",
      });
      setOutput(
        "Submission failed: " +
          (error.response?.data?.errors
            ? JSON.stringify(error.response.data.errors)
            : error.message)
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="h-screen flex flex-col bg-background">
      <header className="border-b p-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Collaborative IDE</h1>
        <div className="flex items-center gap-4">
          <Select value={language} onValueChange={handleLanguageChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select Language" />
            </SelectTrigger>
            <SelectContent>
              {languages.map((lang) => (
                <SelectItem key={lang.value} value={lang.value}>
                  {lang.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button onClick={runCode} disabled={isRunning} size="sm">
            {isRunning ? (
              <div className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
            ) : (
              <Play className="mr-2 h-4 w-4" />
            )}
            {isRunning ? "Running..." : "Run"}
          </Button>
          <Button
            onClick={submitCode}
            disabled={isSubmitting || isRunning}
            size="sm"
          >
            {isSubmitting ? (
              <div className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
            ) : (
              <Check className="mr-2 h-4 w-4" />
            )}
            {isSubmitting ? "Submitting..." : "Submit"}
          </Button>
        </div>
      </header>

      <Split
        className="flex flex-1 overflow-hidden"
        sizes={[60, 40]}
        minSize={200}
        gutterSize={8}
        gutterAlign="center"
        direction="horizontal"
        style={{ display: "flex" }}
      >
        <div className="h-full overflow-hidden">
          <Editor
            height="100%"
            language={language}
            value={code}
            onChange={(value) => setCode(value)}
            onMount={handleEditorDidMount}
            theme="vs-dark"
            options={{
              minimap: { enabled: false },
              fontSize: 14,
              wordWrap: "on",
              scrollBeyondLastLine: false,
              automaticLayout: true,
            }}
          />
        </div>

        <div className="h-full flex flex-col overflow-hidden">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="flex-1 flex flex-col h-full"
          >
            <div className="border-b px-4">
              <TabsList className="mt-2">
                <TabsTrigger value="output">Output</TabsTrigger>
                <TabsTrigger value="problem">Description</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent
              value="output"
              className="flex-1 p-0 m-0 overflow-hidden"
            >
              <Card className="border-0 rounded-none h-full flex flex-col">
                <CardHeader className="px-4 flex-shrink-0">
                  <CardTitle className="text-sm font-medium">
                    Execution Result
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex-1 p-4 bg-black text-white font-mono text-sm overflow-y-auto">
                  {isRunning || isSubmitting ? (
                    <div className="animate-pulse">
                      {isRunning ? "Running code..." : "Submitting code..."}
                    </div>
                  ) : submissionStatus ? (
                    <div
                      className={
                        submissionStatus.type === "success"
                          ? "text-green-400"
                          : "text-red-400"
                      }
                    >
                      <div className="flex items-center gap-2">
                        {submissionStatus.type === "success" ? (
                          <Check className="h-4 w-4" />
                        ) : (
                          <AlertCircle className="h-4 w-4" />
                        )}
                        {submissionStatus.message}
                      </div>
                      {output && (
                        <pre className="mt-2 whitespace-pre-wrap break-words">
                          {output}
                        </pre>
                      )}
                    </div>
                  ) : output ? (
                    <pre className="whitespace-pre-wrap break-words">
                      {output}
                    </pre>
                  ) : (
                    <div className="text-muted-foreground">
                      Run or submit your code to see the output here
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent
              value="problem"
              className="flex-1 p-0 m-0 overflow-hidden"
            >
              <Card className="border-0 rounded-none h-full flex flex-col">
                <CardHeader className="py-2 px-4 flex-shrink-0">
                  <CardTitle className="text-sm font-medium">
                    {loading
                      ? "Loading..."
                      : problem
                      ? problem.title
                      : "Problem Not Found"}
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex-1 p-4 overflow-y-auto">
                  {loading ? (
                    <p className="text-muted-foreground">Fetching problem...</p>
                  ) : error ? (
                    <p className="text-red-500">{error}</p>
                  ) : problem ? (
                    <>
                      <p className="text-muted-foreground mb-4">
                        {problem.description}
                      </p>
                      <p className="text-muted-foreground mb-4">
                        <strong>Difficulty:</strong> {problem.difficulty}
                      </p>
                      <h3 className="text-lg font-semibold">Examples:</h3>
                      <ul className="list-disc pl-4">
                        {problem.examples.map((ex, index) => (
                          <li key={index} className="mb-2">
                            <strong>Input:</strong> {ex.input} <br />
                            <strong>Output:</strong> {ex.output}
                          </li>
                        ))}
                      </ul>
                    </>
                  ) : (
                    <p className="text-muted-foreground">
                      No problem found for this ID.
                    </p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </Split>
    </div>
  );
};

export default IDE;
