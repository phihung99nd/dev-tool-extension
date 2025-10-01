/* eslint-disable @typescript-eslint/no-explicit-any */
import PageBackButton from "@/components/page-back-button"
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CopyIcon } from "lucide-react";
import { useEffect, useState } from "react"

function NumberBase() {
  const [fromBase, setFromBase] = useState('10');
  const [input, setInput] = useState('');
  const [binOutput, setBinOutput] = useState('');
  const [octOutput, setOctOutput] = useState('');
  const [decOutput, setDecOutput] = useState('');
  const [hexOutput, setHexOutput] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const baseType: { [key: string]: any } = {
    '2': 'Binary (2)',
    '8': 'Octal (8)',
    '10': 'Decimal (10)',
    '16': 'Hex (16)',
    '32': 'Base 32'
  }

  const loadSample = () => {
    setFromBase('10')
    setInput('255')
  }

  const convertBase = (str: string, fromBase: number, toBase: number) => {
    // Step 1: Convert input string in fromBase → BigInt decimal
    let decimal = BigInt(0);
    const bigFrom = BigInt(fromBase);
    for (const char of str) {
      const digit = parseInt(char, 36); // supports 0-9 + a-z
      if (isNaN(digit) || digit >= fromBase) {
        throw new Error(`Invalid digit '${char}' for base ${baseType[`${fromBase}`]}`);
      }
      decimal = decimal * bigFrom + BigInt(digit);
    }

    // Step 2: Convert BigInt decimal → toBase string
    if (decimal === 0n) return "0";
    const bigTo = BigInt(toBase);
    let result = "";
    while (decimal > 0) {
      const remainder = decimal % bigTo;
      result = remainder.toString(toBase) + result;
      decimal = decimal / bigTo;
    }
    return result.toUpperCase();
  }

  const handleOutput = (input: string, fromBase: number) => {
    try {
      const binOutput = convertBase(input, fromBase, 2)
      const octOutput = convertBase(input, fromBase, 8)
      const decOutput = convertBase(input, fromBase, 10)
      const hexOutput = convertBase(input, fromBase, 16)

      setBinOutput(binOutput)
      setOctOutput(octOutput)
      setDecOutput(decOutput)
      setHexOutput(hexOutput)
      setErrorMsg('')
    } catch (error: any) {
      setErrorMsg(error.message)
    }
  }

  const copyOutput = (output: string) => {
    navigator.clipboard.writeText(output)
  }

  // Load from chrome.storage
  useEffect(() => {
    chrome.storage.local.get("devtool", (res) => {
      if (res.devtool.baseNumberInput && res.devtool.fromBase) {
        setFromBase(res.devtool.fromBase)
        setInput(res.devtool.baseNumberInput)
      }
    });
  }, []);

  useEffect(() => {
    chrome.storage.local.get("devtool", (res) => {
      const prev = res.devtool || {};
      chrome.storage.local.set({
        devtool: {
          ...prev,
          fromBase,
          baseNumberInput: input,
        },
      });
    });
    handleOutput(input, +fromBase)
  }, [input, fromBase])

  return (
    <div className="grid grid-cols-[50px_1fr] gap-6 w-full h-full">
      <PageBackButton />
      <div>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <label className="text-sm font-medium leading-none mb-2 w-[150px]" htmlFor="base">From base:</label>
            <Select value={fromBase} onValueChange={setFromBase}>
              <SelectTrigger className="w-full bg-background">
                <SelectValue placeholder="Select a fruit" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {
                    Object.entries(baseType).map(([key, value]) => {
                      return (
                        <SelectItem value={key}>{value}</SelectItem>
                      )
                    })
                  }
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <div className="flex gap-1">
            <Button size={"sm"} variant={"outline"} onClick={() => loadSample()}>Sample</Button>
            <Button size={"sm"} variant={"outline"} onClick={() => setInput('')}>Clear</Button>
          </div>
        </div>
        <div className="flex flex-col mt-4">
          <label className="text-sm font-medium leading-none mb-2" htmlFor="input">Input { }</label>
          <input type="text" id="input" min={1} max={100} value={input} onChange={(e) => setInput(e.target.value)} className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm" />
          <span className="text-red-600 h-[18px] mt-2">{errorMsg}</span>
        </div>
        <div className="grid grid-cols-2 grid-rows-2 gap-4 mt-8">
          <div className="flex flex-col">
            <div className="flex items-center justify-between mb-1">
              <label className="text-sm font-medium leading-none mb-2" htmlFor="bin">Binary (2)</label>
              <Button size={"sm"} variant={"outline"} onClick={() => copyOutput(binOutput)}><CopyIcon size={8} /></Button>
            </div>
            <input type="text" id="bin" value={binOutput} readOnly className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center justify-between mb-1">
              <label className="text-sm font-medium leading-none mb-2" htmlFor="oct">Octal (8)</label>
              <Button size={"sm"} variant={"outline"} onClick={() => copyOutput(octOutput)}><CopyIcon size={8} /></Button>
            </div>
            <input type="text" id="oct" value={octOutput} readOnly className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center justify-between mb-1">
              <label className="text-sm font-medium leading-none mb-2" htmlFor="dec">Decimal (10)</label>
              <Button size={"sm"} variant={"outline"} onClick={() => copyOutput(decOutput)}><CopyIcon size={8} /></Button>
            </div>
            <input type="text" id="dec" value={decOutput} readOnly className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center justify-between mb-1">
              <label className="text-sm font-medium leading-none mb-2" htmlFor="hex">Hexadecimal (16)</label>
              <Button size={"sm"} variant={"outline"} onClick={() => copyOutput(hexOutput)}><CopyIcon size={8} /></Button>
            </div>
            <input type="text" id="hex" value={hexOutput} readOnly className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm" />
          </div>
        </div>
      </div>
    </div>
  )
}

export default NumberBase