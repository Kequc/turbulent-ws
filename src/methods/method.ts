import App from "../app";

export default abstract class Method {
    abstract validate (params: any): string|null;
    abstract async process (app: App, params: any): Promise<void>;
}
