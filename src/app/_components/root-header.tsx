"use client";

import React, { useEffect } from "react";
import HeaderItems from "./header-items";
import { postInitCtk } from "../_lib/post-init-ctk";

const RootHeader = () => {
  useEffect(() => {
    postInitCtk();
  }, [])
  return <HeaderItems />;
};

export default RootHeader;
