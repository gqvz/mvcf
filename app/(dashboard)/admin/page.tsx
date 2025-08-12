'use client';

import {useRouter} from "next/navigation";
import React, {useEffect} from "react";

export default function AdminPage(): React.JSX.Element {
   const router = useRouter();
   useEffect(() => {
      router.push("/admin/orders")
   }, []);
   return <></>;
}