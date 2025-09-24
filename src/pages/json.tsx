/* eslint-disable @typescript-eslint/no-explicit-any */
import PageBackButton from "@/components/page-back-button"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { CheckIcon } from "lucide-react";
import { useEffect, useState } from "react"

function CollapsibleJsonViewer({ jsonString }: { jsonString: string }) {
  let data;

  try {
    data = JSON.parse(jsonString);
  } catch (err: any) {
    return <div className="text-red-600">Invalid JSON: {err.message}</div>;
  }

  return (
    <div className="font-mono text-sm h-full max-h-[528px] rounded-md bg-slate-800 overflow-auto">
      <JsonNode value={data} />
    </div>
  );
}

function JsonNode({ value, name }: { value: any, name?: any }) {
  console.log(value)
  const [open, setOpen] = useState(true);

  if (value !== null && typeof value === "object") {
    const isArray = Array.isArray(value);
    const entries = Object.entries(value);

    return (
      <div className="ml-4 relative after:content-[''] after:absolute after:top-[18px] after:left-[4px] after:w-[1px] after:h-[calc(100%-38px)] after:bg-slate-400 after:opacity-50">
        <span className="cursor-pointer text-gray-500 select-none" onClick={() => setOpen(!open)}>{open ? <span>▼</span> : <div className="inline-block rotate-270">▼</div>} </span>
        {name && <span className="text-slate-100">"{name}": </span>}
        <span className="text-gray-500 select-none">
          {isArray ? "[" : "{"}{open ? "" : <span className="cursor-pointer" onClick={() => setOpen(!open)}>...</span>}
        </span>

        {open && (
          <div className="ml-4">
            {entries.map(([key, val], idx) => (
              <div key={idx}>
                <JsonNode value={val} name={isArray ? null : key} />
              </div>
            ))}
          </div>
        )}

        <span className="text-gray-500">{isArray ? "]" : "}"}</span>
      </div>
    );
  }

  // Primitive value (string, number, boolean, null)
  let className = "text-green-600"; // string default
  let displayVal = value;

  if (typeof value === "number") {
    className = "text-orange-600";
  } else if (typeof value === "boolean") {
    className = "text-blue-600";
  } else if (value === null) {
    className = "text-pink-600";
    displayVal = "null";
  } else {
    displayVal = `"${value}"`;
  }

  return (
    <div className="ml-4">
      {name && <span className="text-slate-100">"{name}": </span>}
      <span className={className}>{displayVal}</span>
    </div>
  );
}

const sampleJson = `{
  "name": "John Doe",
  "age": 30,
  "email": "john@example.com",
  "address": {
    "street": "123 Main St",
    "city": "New York",
    "zipCode": "10001"
  },
  "hobbies": ["reading", "coding", "traveling"],
  "isActive": true,
  "lastLogin": "2025-01-31T10:30:00Z"
}`;

function Json() {
  const [inputJson, setInputJson] = useState('');
  const [outputJson, setOutputJson] = useState('');
  const [copyState, setCopyState] = useState(false);
  const [outputTreeView, setOutputTreeView] = useState(false);

  const loadSample = () => {
    setInputJson(sampleJson)
  }

  const copyOutput = () => {
    navigator.clipboard.writeText(outputJson)
      .then(() => {
        setCopyState(true);
        setTimeout(() => {
          setCopyState(false)
        }, 500)
      })
      .catch(() => {

      })
  }

  // Load from chrome.storage
  useEffect(() => {
    chrome.storage.local.get("devtool", (res) => {
      if (res.devtool) {
        setInputJson(res.devtool.json || "");
      }
    });
  }, []);

  useEffect(() => {
    chrome.storage.local.get("devtool", (res) => {
      const prev = res.devtool || {};
      chrome.storage.local.set({
        devtool: {
          ...prev,
          json: inputJson,
        },
      });
    });
    try {
      // Try to parse JSON
      const obj = JSON.parse(inputJson);
      const formattedJson = JSON.stringify(obj, null, 2); // pretty print
      setOutputJson(formattedJson)
    } catch (err: any) {
      // If invalid JSON
      if (!inputJson) {
        setOutputJson('')
      } else {
        setOutputJson(`Invalid JSON: ${err.message}`)
      }
    }
  }, [inputJson])

  return (
    <div className="grid grid-cols-[50px_1fr] gap-6 w-full h-full">
      <PageBackButton />
      <div className="grid grid-cols-2 gap-4 w-full h-full">
        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Raw JSON</span>
            <div className="flex gap-1">
              <Button size={"sm"} variant={"outline"} onClick={() => setInputJson('')}>Clear</Button>
              <Button size={"sm"} variant={"outline"} onClick={loadSample}>Load Sample</Button>
            </div>
          </div>
          <textarea value={inputJson} onChange={(e) => setInputJson(e.target.value)} placeholder="Paste your JSON here..." className="flex min-h-[80px] rounded-md border px-3 py-2 ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 text-xs h-full w-full resize-none font-mono bg-slate-100 focus-visible:ring-0 focus-visible:ring-offset-0">

          </textarea>
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Formatted JSON</span>
            <div className="flex gap-1">
              <Button size={"sm"} variant={"outline"} onClick={copyOutput}>Copy {copyState && <CheckIcon color="#20c45f" size={8} />}</Button>
              <div className="flex items-center gap-1">
                <label className={!outputTreeView ? 'font-medium' : ''} htmlFor="code">
                  Code
                </label>
                <Switch checked={outputTreeView} onCheckedChange={setOutputTreeView} className="data-[state=unchecked]:bg-blue-400" />
                <label className={outputTreeView ? 'font-medium' : ''} htmlFor="tree">
                  Tree
                </label>
              </div>
            </div>
          </div>
          {
            !outputTreeView && (
              <textarea value={outputJson} placeholder="Formatted JSON will appear here..." readOnly className="flex min-h-[80px] rounded-md border px-3 py-2 ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 text-xs h-full w-full resize-none font-mono bg-slate-100 focus-visible:ring-0 focus-visible:ring-offset-0" />
            )
          }
          {
            outputTreeView && <CollapsibleJsonViewer jsonString={inputJson} />
          }
        </div>
      </div>
    </div>
  )
}

export default Json