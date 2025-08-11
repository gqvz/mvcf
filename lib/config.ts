import {Configuration} from "@/lib/gen/runtime";

const Config = new Configuration({
    apiKey: () => "Bearer " + localStorage.getItem("token"),
    basePath: "http://localhost:3001/api"
});

export default Config;