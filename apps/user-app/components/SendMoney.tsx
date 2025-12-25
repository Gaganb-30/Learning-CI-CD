"use client";

import { Button } from "@repo/ui/button";
import { Card } from "@repo/ui/card";
import { Center } from "@repo/ui/center";
import { TextInput } from "@repo/ui/textinput";
import { useState } from "react";
import { p2pTransfer } from "../app/lib/actions/p2ptransfer";

const SendMoney = () => {
  const [amount, setAmount] = useState(0);
  const [number, setNumber] = useState("");
  return (
    <div className="h-[90vh]">
      <Center>
        <Card title="Send">
          <div className="min-w-80 pt-2"></div>
          <TextInput
            label={"Number"}
            placeholder={"Enter number"}
            onChange={(value) => {
              setNumber(value);
            }}
          />
          <TextInput
            label={"Amount"}
            placeholder={"Amount"}
            onChange={(value) => {
              setAmount(Number(value));
            }}
          />
          <div className="pt-4 flex justify-center">
            <Button
              onClick={async () => {
                await p2pTransfer(number, amount * 100);
              }}
            >
              Send
            </Button>
          </div>
        </Card>
      </Center>
    </div>
  );
};

export default SendMoney;
