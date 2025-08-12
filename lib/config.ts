import {Configuration} from "@/lib/gen/runtime";

const Config = new Configuration({
    apiKey: () => "Bearer " + localStorage.getItem("token"),
    basePath: process.env.BASE_URL || "http://localhost:3000/api",
});

export default Config;