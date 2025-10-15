import PageBackButton from "@/components/page-back-button";
import { Button } from "@/components/ui/button";
import { CheckIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

function Jwt() {
  const [jwt, setJwt] = useState('')
  const [header, setHeader] = useState('')
  const [payload, setPayload] = useState('')
  const [copyHeaderState, setCopyHeaderState] = useState(false);
  const [copyPayloadState, setCopyPayloadState] = useState(false);

  const parts = jwt.split(".")
  const colors = ["text-[#ed143d]", "text-[#2e8b57]", "text-[#00008b]"]

  const loadSample = () => {
    setJwt('eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWUsImlhdCI6MTUxNjIzOTAyMn0.NHVaYe26MbtOYhSKkoKYdFVomg4i8ZJd8_-RU8VNbftc4TSMb4bXP3l3YlNWACwyXPGffz5aXHc6lty1Y2t4SWRqGteragsVdZufDn5BlnJl9pdR_kdVFUsra2rWKEofkZeIC4yWytE58sMIihvo9H1ScmmVwBcQP6XETqYd0aSHp1gOa9RdUPDvoXQ5oqygTqVtxaDr6wUFKrKItgBMzWIdNZ6y7O9E0DhEPTbE9rfBo6KTFsHAZnMg4k68CDp2woYIaXbmYTWcvbzIuHO7_37GT79XdIwkm95QJ7hYC9RiwrV7mesbY4PAahERJawntho0my942XheVLmGwLMBkQ')
  }

  const copyHeader = () => {
    navigator.clipboard.writeText(header)
      .then(() => {
        setCopyHeaderState(true);
        setTimeout(() => {
          setCopyHeaderState(false)
        }, 500)
      })
      .catch(() => {

      })
  }

  const copyPayload = () => {
    navigator.clipboard.writeText(payload)
      .then(() => {
        setCopyPayloadState(true);
        setTimeout(() => {
          setCopyPayloadState(false)
        }, 500)
      })
      .catch(() => {

      })
  }

  // Load from chrome.storage
  useEffect(() => {
    chrome.storage.local.get("devtool", (res) => {
      if (res.devtool) {
        setJwt(res.devtool.jwt || "");
      }
    });
  }, []);

  useEffect(() => {
    chrome.storage.local.get("devtool", (res) => {
      const prev = res.devtool || {};
      chrome.storage.local.set({
        devtool: {
          ...prev,
          jwt,
        },
      });
    });
    if (!jwt) {
      setHeader("");
      setPayload("");
      return;
    }

    try {
      // jwt-decode decodes payload only
      const decodedPayload = jwtDecode(jwt);
      setPayload(JSON.stringify(decodedPayload, null, 2));

      // decode header manually with jwt-decode's helper
      const headerPart = jwt.split(".")[0];
      const decodedHeader = JSON.parse(atob(headerPart.replace(/-/g, "+").replace(/_/g, "/")));
      setHeader(JSON.stringify(decodedHeader, null, 2));
    } catch {
      setHeader("Invalid JWT");
      setPayload("Invalid JWT");
    }
  }, [jwt]);

  return (
    <div className="grid grid-cols-[50px_1fr] gap-6 w-full h-full">
      <PageBackButton />
      <div className="grid grid-cols-2 gap-4 w-full h-full">
        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">JWT Token</span>
            <div className="flex gap-1">
              <Button size={"sm"} variant={"outline"} onClick={() => setJwt('')}>Clear</Button>
              <Button size={"sm"} variant={"outline"} onClick={loadSample}>Load Sample</Button>
            </div>
          </div>
          <div className="relative w-full h-full">
            <pre
              id="jwt-highlight"
              className="absolute leading-[inherit] w-full h-full border border-transparent px-3 py-2 whitespace-pre-wrap break-words break-keep pointer-events-none overflow-auto"
              aria-hidden="true"
            >
              {parts.map((part, i) => (
                <span key={i} className={colors[i] || "text-gray-400"}>
                  {part}
                  {i < parts.length - 1 && <span className="text-gray-400">.</span>}
                </span>
              ))}
            </pre>
            <textarea
              value={jwt}
              onChange={(e) => setJwt(e.target.value)}
              placeholder="Paste your JSON here..."
              className="flex min-h-[80px] leading-[inherit] text-transparent whitespace-pre-wrap break-words break-keep caret-black selection:bg-blue-200 rounded-md border px-3 py-2 ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 text-xs h-full w-full resize-none font-mono bg-slate-100 focus-visible:ring-0 focus-visible:ring-offset-0 overflow-auto"              onScroll={(e) => {
                const pre = document.getElementById("jwt-highlight");
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                if (pre) pre.scrollTop = (e.target as any).scrollTop;
              }}
            ></textarea>
          </div>
        </div>
        <div className="flex flex-col gap-2 w-full h-full">
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Decoded header</span>
              <div className="flex gap-1">
                <Button size={"sm"} variant={"outline"} onClick={() => copyHeader()}>Copy {copyHeaderState && <CheckIcon color="#20c45f" size={8} />}</Button>
              </div>
            </div>
            <textarea value={header} readOnly className="flex h-[100px] rounded-md border px-3 py-2 ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 text-xs w-full resize-none font-mono bg-slate-100 focus-visible:ring-0 focus-visible:ring-offset-0" />
          </div>
          <div className="flex flex-col gap-2 h-full">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Decoded payload</span>
              <div className="flex gap-1">
                <Button size={"sm"} variant={"outline"} onClick={() => copyPayload()}>Copy {copyPayloadState && <CheckIcon color="#20c45f" size={8} />}</Button>
              </div>
            </div>
            <textarea value={payload} readOnly className="flex min-h-[80px] rounded-md border px-3 py-2 ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 text-xs h-full w-full resize-none font-mono bg-slate-100 focus-visible:ring-0 focus-visible:ring-offset-0" />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Jwt