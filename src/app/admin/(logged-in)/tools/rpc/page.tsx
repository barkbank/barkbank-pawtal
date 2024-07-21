"use client";

import { BarkError } from "@/components/bark/bark-error";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { postAdminCommand } from "./_lib/post-admin-command";
import { BarkForm } from "@/components/bark/bark-form";
import {
  getCommandNames,
  getCommandRequestExample,
  isCommandName,
} from "@/lib/admin/rpc/command-index";
import { BarkFormTextArea } from "@/components/bark/bark-form-text-area";
import { BarkBackLink } from "@/components/bark/bark-back-link";
import { RoutePath } from "@/lib/route-path";
import { BarkFormAutocomplete } from "@/components/bark/bark-form-autocomplete";

const CommandRequestSchema = z.object({
  commandName: z.string(),
  request: z.string(),
});

type CommandRequest = z.infer<typeof CommandRequestSchema>;

export default function Page() {
  const { toast } = useToast();
  const [result, setResult] = useState<string>("");
  const [error, setError] = useState<string>("");

  const form = useForm<CommandRequest>({
    resolver: zodResolver(CommandRequestSchema),
    defaultValues: {
      commandName: "",
      request: "",
    },
  });

  const onSubmit = async (values: CommandRequest) => {
    const { commandName, request } = values;
    setResult("");
    toast({ variant: "default", title: "Sending command..." });
    const { result, error } = await postAdminCommand({ commandName, request });
    if (error !== undefined) {
      toast({ variant: "destructive", title: "Command failed" });
      setError(error);
      return;
    }
    toast({
      variant: "default",
      title: "Command successful",
    });
    setResult(result);
    setError("");
  };
  const commandSuggestions = getCommandNames();
  const { commandName: selectedCommandName } = form.watch();
  const onUseExample = () => {
    if (isCommandName(selectedCommandName)) {
      form.setValue("request", getCommandRequestExample(selectedCommandName));
    }
  };

  return (
    <div className="m-3 flex flex-col gap-3">
      <BarkBackLink href={RoutePath.ADMIN_TOOLS_PAGE} />
      <div className="prose">
        <h1>RPC</h1>
        <p>
          Select a command from the dropdown selection. Provide a request body,
          if the selected command requires it.
        </p>
      </div>
      <div className="x-card w-full">
        <p className="x-card-title">Request</p>
        <BarkForm form={form} onSubmit={onSubmit}>
          <BarkFormAutocomplete
            form={form}
            label="Command"
            name="commandName"
            suggestions={commandSuggestions}
            value={selectedCommandName}
            onEmptyQuery="MATCH_ALL"
          />
          <BarkFormTextArea
            form={form}
            label="Request Body"
            name="request"
            rows={8}
          />
          <div className="flex flex-col gap-3 md:flex-row">
            <Button
              variant="default"
              className="w-full p-6 md:w-40"
              type="submit"
            >
              Send Request
            </Button>
            <Button
              variant="secondary"
              className="w-full p-6 md:w-40"
              type="button"
              onClick={onUseExample}
            >
              Load Example
            </Button>
          </div>
        </BarkForm>
      </div>
      {result !== "" && (
        <div className="x-card w-full">
          <p className="x-card-title">Response</p>
          <div className="prose">
            <pre>{_getPrettyResult(result)}</pre>
          </div>
        </div>
      )}
      {error && <BarkError>{error}</BarkError>}
    </div>
  );
}

function _getPrettyResult(result: string): string {
  try {
    const obj = JSON.parse(result);
    return JSON.stringify(obj, null, 2);
  } catch {
    return result;
  }
}
