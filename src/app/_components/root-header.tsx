import React from "react";
import { getLoggedInSession } from "@/lib/auth";

import HeaderItems from "./header-items";

const RootHeader = async () => {
  const session = await getLoggedInSession();
  const accountType = session?.accountType;

  return <HeaderItems accountType={accountType} />;
};

export default RootHeader;
