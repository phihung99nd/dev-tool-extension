/* eslint-disable @typescript-eslint/no-explicit-any */
import PageBackButton from "@/components/page-back-button";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CheckIcon } from "lucide-react";
import { useEffect, useState } from "react";

const loremWords = [
  "lorem", "ipsum", "dolor", "sit", "amet", "consectetur", "adipiscing", "elit",
  "sed", "do", "eiusmod", "tempor", "incididunt", "ut", "labore", "dolore",
  "magna", "aliqua", "enim", "minim", "veniam", "quis", "nostrud",
  "exercitation", "ullamco", "laboris", "nisi", "aliquip", "ex", "ea",
  "commodo", "consequat", "aute", "irure", "reprehenderit", "voluptate",
  "velit", "esse", "cillum", "fugiat", "nulla", "pariatur", "excepteur",
  "sint", "occaecat", "cupidatat", "non", "proident", "sunt", "culpa",
  "officia", "deserunt", "mollit", "anim", "id", "est", "laborum"
];

function LoremIpsum() {
  const [count, setCount] = useState(5);
  const [type, setType] = useState<string>('paragraph');
  const [check, setCheck] = useState<any>(false);
  const [result, setResult] = useState('');
  const [copyState, setCopyState] = useState(false);

  const getRandomWord = () => {
    return loremWords[Math.floor(Math.random() * loremWords.length)];
  }

  const generateLorem = (
    type: string,
    count: number,
    startWithLorem: boolean
  ): any => {
    if (type === "word") {
      return Array.from({ length: count }, getRandomWord).join(" ");
    }

    if (type === "sentence") {
      return Array.from({ length: count }, () => {
        const sentenceLength = Math.floor(Math.random() * 8) + 5; // 5–12 words
        let sentence = Array.from({ length: sentenceLength }, getRandomWord).join(" ");
        if (startWithLorem) {
          sentence = "lorem ipsum " + sentence;
        }
        sentence = sentence.charAt(0).toUpperCase() + sentence.slice(1) + ".";
        return sentence;
      }).join(" ");
    }

    if (type === "paragraph") {
      return Array.from({ length: count }, () => {
        const sentenceCount = Math.floor(Math.random() * 4) + 3; // 3–6 sentences
        let paragraph = generateLorem("sentence", sentenceCount, startWithLorem);

        if (startWithLorem) {
          // Make sure each paragraph itself also begins with "Lorem ipsum"
          if (!paragraph.toLowerCase().startsWith("lorem ipsum")) {
            paragraph = "Lorem ipsum " + paragraph.charAt(0).toLowerCase() + paragraph.slice(1);
          }
        }

        return paragraph;
      }).join("\n\n");
    }
  }
  const generate = () => {
    setResult(generateLorem(type, count, check) || "")
  }

  const copyOutput = () => {
    navigator.clipboard.writeText(result)
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
        setCount(res.devtool.loremCount || 5);
        setType(res.devtool.loremType || "paragraph");
        setCheck(res.devtool.loremCheck || false);
        setResult(res.devtool.loremResult || "");
      }
    });
  }, []);

  useEffect(() => {
    chrome.storage.local.get("devtool", (res) => {
      const prev = res.devtool || {};
      chrome.storage.local.set({
        devtool: {
          ...prev,
          loremCount: count,
          loremType: type,
          loremCheck: check,
          loremResult: result,
        },
      });
    });
  }, [count, type, check, result])

  return (
    <div className="grid grid-cols-[50px_1fr] gap-6 w-full h-full">
      <PageBackButton />
      <div className="grid grid-cols-[1fr_2fr] gap-4 w-full h-full">
        <div className="border rounded-md px-3 py-2">
          <div className="text-lg font-medium">Settings</div>
          <div className="pt-4 space-y-4">
            <div className="flex flex-col">
              <label className="text-sm font-medium leading-none mb-2" htmlFor="count">Count</label>
              <input type="number" id="count" min={1} max={100} value={count} onChange={(e) => setCount(Number(e.target.value))} className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm" />
            </div>
            <div className="flex flex-col">
              <label className="text-sm font-medium leading-none mb-2" htmlFor="type">Type</label>
              <Select value={type} onValueChange={setType}>
                <SelectTrigger className="w-full bg-background">
                  <SelectValue placeholder="Select a fruit" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="word">Word</SelectItem>
                    <SelectItem value="sentence">Sentence</SelectItem>
                    <SelectItem value="paragraph">Paragraph</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div className="mt-4 flex items-center gap-2">
              <Checkbox id="check" className="border-slate-500 cursor-pointer" value={check} onCheckedChange={setCheck} />
              <label className="text-sm font-medium leading-none cursor-pointer" htmlFor="check">Start with "Lorem ipsum"</label>
            </div>
            <Button size={"sm"} className="w-full" onClick={generate}>Generate</Button>

          </div>
        </div>
        <div className="border rounded-md px-3 py-2 flex flex-col gap-4">
          <div className="text-lg font-medium">Generated Text</div>
          <div>
            <Button size={"sm"} variant={"outline"} onClick={copyOutput}>Copy {copyState && <CheckIcon color="#20c45f" size={8} />}</Button>
          </div>
          <textarea value={result} readOnly className="flex grow-1 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm min-h-96 font-serif leading-relaxed resize-none custom-scrollbar"></textarea>
        </div>
      </div>
    </div>
  )
}

export default LoremIpsum