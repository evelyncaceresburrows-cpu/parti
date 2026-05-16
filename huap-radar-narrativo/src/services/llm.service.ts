export class LlmService {
  summarize(text: string): string {
    return text.length > 180 ? `${text.slice(0, 177)}...` : text;
  }
}
