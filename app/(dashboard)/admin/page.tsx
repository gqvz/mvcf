'use client';

import {useRouter} from "next/navigation";
import React from "react";

export default function AdminPage(): React.JSX.Element {
   const router = useRouter();
   router.push("/admin/users");
   return <></>;
}