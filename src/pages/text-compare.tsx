import PageBackButton from "@/components/page-back-button";
import { Button } from "@/components/ui/button";
import { diffChars, type ChangeObject } from "diff";
import { XIcon } from "lucide-react";
import { useEffect, useState } from "react";

function TextCompare() {
  const [text1, setText1] = useState("");
  const [text2, setText2] = useState("");
  const [diffResult, setDiffResult] = useState<ChangeObject<string>[]>([]);

  const compareTexts = () => {
    const diff = diffChars(text1, text2); // character-level diff
    setDiffResult(diff);
  };

  // Load from chrome.storage
  useEffect(() => {
    chrome.storage.local.get("devtool", (res) => {
      if (res.devtool) {
        setText1(res.devtool.text1 || "");
        setText2(res.devtool.text2 || "");
      }
    });
  }, []);

  useEffect(() => {
    chrome.storage.local.get("devtool", (res) => {
      const prev = res.devtool || {};
      chrome.storage.local.set({
        devtool: {
          ...prev,
          text1,
          text2,
        },
      });
    });
    if (text1 && text2) {
      compareTexts()
    }
  }, [text1, text2])

  return (
    <div className="grid grid-cols-[50px_1fr] gap-6 w-full h-full">
      <PageBackButton />
      <div className="grid grid-cols-[2fr_1fr] gap-4 w-full h-full">
        <div className="grid grid-rows-2 gap-4 w-full h-full">
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Original text</span>
              <div className="flex gap-1">
                <Button size={"sm"} variant={"outline"} onClick={() => setText1('')}>Clear <XIcon size={8} /></Button>
              </div>
            </div>
            <textarea value={text1} onChange={(e) => setText1(e.target.value)} placeholder="Enter or paste your text here..." className="flex min-h-[80px] rounded-md border px-3 py-2 ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 text-xs h-full w-full resize-none font-mono bg-slate-100 focus-visible:ring-0 focus-visible:ring-offset-0" />
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Compare text</span>
              <div className="flex gap-1">
                <Button size={"sm"} variant={"outline"} onClick={() => setText2('')}>Clear <XIcon size={8} /></Button>
              </div>
            </div>
            <textarea value={text2} onChange={(e) => setText2(e.target.value)} placeholder="Enter or paste your text here..." className="flex min-h-[80px] rounded-md border px-3 py-2 ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 text-xs h-full w-full resize-none font-mono bg-slate-100 focus-visible:ring-0 focus-visible:ring-offset-0" />
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <span className="text-sm font-medium leading-[32px]">Differences</span>
          <div className="w-full min-h-40 grow-1 p-2 border rounded-md bg-slate-100 whitespace-pre-wrap">
            {diffResult.length === 0 && (
              <span className="text-gray-400">Differences will appear here...</span>
            )}
            {diffResult.map((part, idx) => {
              let style = "";
              if (part.added) style = "bg-green-200 text-green-900";
              else if (part.removed) style = "bg-red-200 text-red-900";
              else style = "text-gray-800";

              return (
                <span key={idx} className={style}>
                  {part.value}
                </span>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

export default TextCompare