import { AddVetAccounts } from "./commands/add-vet-accounts";
import { ListVetClinics } from "./commands/list-vet-clinics";
import { ListVetAccountsByVet } from "./commands/list-vet-accounts-by-vet";
import { DeleteVetAccount } from "./commands/delete-vet-account";

export const COMMANDS = {
  ListVetClinics: new ListVetClinics(),
  AddVetAccounts: new AddVetAccounts(),
  ListVetAccountsByVet: new ListVetAccountsByVet(),
  DeleteVetAccount: new DeleteVetAccount(),
} as const;

export type CommandName = keyof typeof COMMANDS;

export function isCommandName(commandName: string): commandName is CommandName {
  return commandName in COMMANDS;
}

export function getCommandNames(): CommandName[] {
  return Object.keys(COMMANDS).filter(isCommandName);
}

export function getCommandRequestExample(commandName: CommandName): string {
  if (isCommandName(commandName)) {
    const cmd = COMMANDS[commandName];
    return cmd.getExampleRequest();
  }
  return "";
}
