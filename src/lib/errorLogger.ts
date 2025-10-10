/**
 * Утилита для логирования ошибок клиента
 * Перехватывает ошибки и отправляет их на сервер или в консоль
 */

interface ErrorLog {
  timestamp: string;
  message: string;
  stack?: string;
  url: string;
  userAgent: string;
  type: 'error' | 'warning' | 'info';
}

class ErrorLogger {
  private logs: ErrorLog[] = [];
  private maxLogs = 100;

  constructor() {
    if (typeof window !== 'undefined') {
      this.setupGlobalErrorHandler();
      this.setupUnhandledRejectionHandler();
    }
  }

  /**
   * Перехватываем все необработанные ошибки
   */
  private setupGlobalErrorHandler() {
    window.addEventListener('error', (event) => {
      this.log({
        timestamp: new Date().toISOString(),
        message: event.message,
        stack: event.error?.stack,
        url: window.location.href,
        userAgent: navigator.userAgent,
        type: 'error',
      });
    });
  }

  /**
   * Перехватываем необработанные Promise rejections
   */
  private setupUnhandledRejectionHandler() {
    window.addEventListener('unhandledrejection', (event) => {
      this.log({
        timestamp: new Date().toISOString(),
        message: `Unhandled Promise Rejection: ${event.reason}`,
        stack: event.reason?.stack,
        url: window.location.href,
        userAgent: navigator.userAgent,
        type: 'error',
      });
    });
  }

  /**
   * Сохраняем лог
   */
  private log(error: ErrorLog) {
    this.logs.push(error);
    
    // Ограничиваем количество логов
    if (this.logs.length > this.maxLogs) {
      this.logs.shift();
    }

    // Выводим в консоль для разработки
    console.error('🔴 Error logged:', error);

    // Опционально: отправляем на сервер
    this.sendToServer(error);
  }

  /**
   * Отправляем логи на сервер (опционально)
   */
  private async sendToServer(error: ErrorLog) {
    try {
      // Отправляем на MCP сервер (если запущен локально)
      const mcpServerUrl = process.env.NEXT_PUBLIC_MCP_SERVER_URL || 'http://localhost:3001';
      
      await fetch(`${mcpServerUrl}/api/log`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(error),
      });
      
      console.log('📤 Log sent to MCP server');
    } catch (err) {
      // Не показываем ошибку, если MCP сервер не запущен
      // console.error('Failed to send error to server:', err);
    }
  }

  /**
   * Получить все логи
   */
  public getLogs(): ErrorLog[] {
    return [...this.logs];
  }

  /**
   * Очистить логи
   */
  public clearLogs() {
    this.logs = [];
  }

  /**
   * Экспортировать логи в JSON
   */
  public exportLogs(): string {
    return JSON.stringify(this.logs, null, 2);
  }

  /**
   * Экспортировать логи в Markdown формате
   */
  public exportAsMarkdown(): string {
    if (this.logs.length === 0) {
      return '# 📊 Error Logs\n\n✅ No errors logged yet!';
    }

    let markdown = '# 📊 Error Logs\n\n';
    markdown += `**Total Errors:** ${this.logs.length}\n`;
    markdown += `**Generated:** ${new Date().toLocaleString('ru-RU')}\n\n`;
    markdown += '---\n\n';

    this.logs.forEach((log, index) => {
      const emoji = log.type === 'error' ? '❌' : log.type === 'warning' ? '⚠️' : 'ℹ️';
      
      markdown += `## ${emoji} Error #${index + 1}\n\n`;
      markdown += `**Time:** ${new Date(log.timestamp).toLocaleString('ru-RU')}\n`;
      markdown += `**Type:** ${log.type}\n`;
      markdown += `**URL:** ${log.url}\n`;
      markdown += `**Message:**\n\`\`\`\n${log.message}\n\`\`\`\n\n`;
      
      if (log.stack) {
        markdown += `**Stack Trace:**\n\`\`\`\n${log.stack}\n\`\`\`\n\n`;
      }
      
      markdown += `**User Agent:** ${log.userAgent}\n\n`;
      markdown += '---\n\n';
    });

    return markdown;
  }

  /**
   * Скопировать логи в буфер обмена как Markdown
   */
  public async copyAsMarkdown(): Promise<boolean> {
    try {
      const markdown = this.exportAsMarkdown();
      await navigator.clipboard.writeText(markdown);
      console.log('✅ Logs copied to clipboard as Markdown!');
      return true;
    } catch (error) {
      console.error('❌ Failed to copy to clipboard:', error);
      return false;
    }
  }

  /**
   * Скачать логи как файл
   */
  public downloadLogs() {
    const data = this.exportLogs();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `error-logs-${new Date().toISOString()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  /**
   * Скачать логи как Markdown файл
   */
  public downloadAsMarkdown() {
    const data = this.exportAsMarkdown();
    const blob = new Blob([data], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `error-logs-${new Date().toISOString()}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    console.log('✅ Markdown file downloaded!');
  }

  /**
   * Вывести логи в консоль в Markdown формате (для копирования)
   */
  public printMarkdown() {
    const markdown = this.exportAsMarkdown();
    console.log('\n' + '='.repeat(80));
    console.log('📋 COPY THIS MARKDOWN AND PASTE TO COPILOT:');
    console.log('='.repeat(80) + '\n');
    console.log(markdown);
    console.log('\n' + '='.repeat(80));
    console.log('✅ Select and copy the text above');
    console.log('='.repeat(80) + '\n');
  }

  /**
   * Ручное логирование
   */
  public logError(message: string, details?: any) {
    this.log({
      timestamp: new Date().toISOString(),
      message,
      stack: details?.stack || new Error().stack,
      url: typeof window !== 'undefined' ? window.location.href : '',
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
      type: 'error',
    });
  }

  public logWarning(message: string, details?: any) {
    this.log({
      timestamp: new Date().toISOString(),
      message,
      stack: details?.stack,
      url: typeof window !== 'undefined' ? window.location.href : '',
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
      type: 'warning',
    });
  }

  public logInfo(message: string, details?: any) {
    this.log({
      timestamp: new Date().toISOString(),
      message,
      stack: details?.stack,
      url: typeof window !== 'undefined' ? window.location.href : '',
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
      type: 'info',
    });
  }
}

// Создаем singleton instance
const errorLogger = typeof window !== 'undefined' ? new ErrorLogger() : null;

// Экспортируем для использования в компонентах
export default errorLogger;

// Для доступа из консоли браузера
if (typeof window !== 'undefined') {
  (window as any).errorLogger = errorLogger;
}
