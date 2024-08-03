import { LogName } from "../enums/log-name";

export function opLogEvent(args: {
  logName: LogName;
  params: Record<string, any>;
}) {
  const { logName, params } = args;
  if ("logName" in params) {
    throw new Error("params cannot have reserved name logName");
  }
  const event = { logName, ...params };
  const msg = JSON.stringify(event);
  console.log(msg);
}
