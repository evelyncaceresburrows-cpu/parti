export class AuditService {
  private logs: Array<{ event: string; timestamp: string; payload: unknown }> = [];

  record(event: string, payload: unknown): void {
    this.logs.push({ event, timestamp: new Date().toISOString(), payload });
  }

  list(): Array<{ event: string; timestamp: string; payload: unknown }> {
    return this.logs;
  }
}
