let axios = require("axios");
let StackTrace = require("stacktrace-js");

declare global {
  interface Window {
    MothershipConfig: any;
    MothershipJs: any;
  }
}

interface Window {
  Mothership: Mothership;
}

interface MothershipOptions {
  [option: string]: any;
  apiKey: string;
  enabled: boolean;
  minimumErrorLevel: string; // critical, error, warn, info, debug,
  environment: string;
  version: string;
  customPayload: object;
  allowedDomains: Array<string>;
  disallowedDomains: Array<string>;
  disableIPCapture: boolean;
  captureUncaught: boolean;
}

interface Trace {
  [option: string]: any;
  message?: string;
  stack?: Array<string>;
}

export default class Mothership {
  private defaultOptions: MothershipOptions = {
    apiKey: "",
    enabled: true,
    environment: null,
    version: null,
    minimumErrorLevel: "debug",
    customPayload: {},
    allowedDomains: [],
    disallowedDomains: [],
    disableIPCapture: false,
    captureUncaught: true
  };

  constructor(public options: MothershipOptions) {
    this.options = Object.assign({}, this.defaultOptions, this.options);
    this.init();
  }

  set apiKey(value: string) {
    this.options.apiKey = value;
  }

  set enabled(value: boolean) {
    this.options.enabled = value;
  }

  set minimumErrorLevel(value: string) {
    this.options.minimumErrorLevel = value;
  }

  set environment(value: string) {
    this.options.environment = value;
  }

  set version(value: string) {
    this.options.version = value;
  }

  set customPayload(value: object) {
    this.options.customPayload = value;
  }

  set allowedDomains(value: Array<string>) {
    this.options.allowedDomains = value;
  }

  set disallowedDomains(value: Array<string>) {
    this.options.allowedDomains = value;
  }

  set disableIPCapture(value: boolean) {
    this.options.disableIPCapture = value;
  }

  set captureUncaught(value: boolean) {
    this.options.captureUncaught = value;
  }

  /**
   * Checks to see if the error logger is enabled and if it is
   * sends along the error to [[sendLog]]
   *
   * @param msg       The message captured or passed to us manually
   * @param url       URL captured or passed to us manually
   * @param error     Error object with stack trace
   */
  error(
    msg: string,
    url: string = null,
    error: object = null,
    type: string = null
  ) {
    if (this.options.enabled) {
      if (type === null) {
        type = 'error'
      }
      if (this.checkLevel(type) && this.checkDomains(url)) {
        const request = this.buildRequestObject(
          type,
          msg,
          url,
          error
        )
        .then(request => {
          this.sendLog(request);
        })
        .catch(error => {
          console.warn("Could not parse the stack trace", error);
        });
      }
    }
  }

  critical(
    msg: string,
    url: string = null,
    error: object = null,
  ) {
    this.error(msg, url, error, 'critical')
  }
  warn(
    msg: string,
    url: string = null,
    error: object = null,
  ) {
    this.error(msg, url, error, 'warn')
  }
  info(
    msg: string,
    url: string = null,
    error: object = null,
  ) {
    this.error(msg, url, error, 'info')
  }
  debug(
    msg: string,
    url: string = null,
    error: object = null,
  ) {
    this.error(msg, url, error, 'debug')
  }

  /**
   * Starts the uncaught error handler listener
   */
  private init(): void {
    window.onerror = (msg, url, lineNo, columnNo, error) => {
      this.uncaughtError(msg, url, error);
    };
  }

  private checkLevel(type: string): boolean {
    if (this.options.minimumErrorLevel === 'debug') {
      return true
    } else if (this.options.minimumErrorLevel === 'info') {
      if (type !== 'debug') {
        return true;
      }
    } else if (this.options.minimumErrorLevel === 'warn') {
      if (type !== 'debug' && type !== 'info') {
        return true;
      }
    }  else if (this.options.minimumErrorLevel === 'error') {
      if (type === 'error' || type === 'critical') {
        return true;
      }
    }  else if (this.options.minimumErrorLevel === 'critical') {
      if (type === 'critical') {
        return true;
      }
    } 

    return false
  }

  private checkDomains(url: string): boolean {
    
    if (this.options.allowedDomains.length > 0) {
      const domain = url.replace('http://','').replace('https://','').split(/[/?#]/)[0];
      if (!this.options.allowedDomains.includes(domain)) {
        return false
      }
    }
    if (this.options.disallowedDomains.length > 0) {
      const domain = url.replace('http://','').replace('https://','').split(/[/?#]/)[0];
      if (this.options.disallowedDomains.includes(domain)) {
        return false
      }
    }

    return true
  }

  /**
   * Builds the request object and returns it
   *
   * @param level     What level is the log?
   * @param msg       The message that is emitted from the browser
   * @param url       URL captured from the browser error event
   * @param error     Error object with stack trace
   */
  private buildRequestObject(
    level: string,
    msg: string | Event,
    url: string = null,
    error: object = null
  ): Promise<object> {
    return new Promise((resolve, reject) => {
      const trace: Trace =
        error !== null ? error : { message: null, stack: null };

      StackTrace.fromError(error)
        .then((stackFrame: Array<object>) => {
          resolve({
            custom: this.options.customPayload,
            disableIPCapture: this.options.disableIPCapture,
            environment: this.options.environment,
            level: level,
            message: msg,
            platform: navigator.userAgent,
            trace: {
              message: trace.message,
              stack: stackFrame
            },
            url: url,
            version: this.options.version,
          });
        })
        .catch((error: Error) => {
          reject(error);
        });
    });
  }

  /**
   * Handles any uncaught errors in the code and gets the request and
   * sends it along to [[sendLog]] if captureUncaught is on in the options
   *
   * @param msg       The message that is emitted from the browser
   * @param url       URL captured from the browser error event
   * @param error     Error object with stack trace
   */
  private uncaughtError(
    msg: string | Event,
    url: string = null,
    error: object = null
  ): void {
    if (this.options.enabled && this.options.captureUncaught && this.checkLevel('error') && this.checkDomains(url)) {
      this.buildRequestObject("error", msg, url, error)
        .then(request => {
          this.sendLog(request);
        })
        .catch(error => {
          console.warn("Could not parse the stack trace", error);
        });
    }
  }

  /**
   * Sends the log back to Mothership
   *
   * @param request     The request payload
   */
  private sendLog(request: object): void {

    if (this.options.apiKey === "") {
      console.warn("Mothership Error: Please set your apiKey");
    } else {
      axios
        .post(`https://mothership.app/api/v1/logs/js`, request, {
          headers: { Authorization: "Bearer " + this.options.apiKey }
        })
        .catch((error: object) => {
          console.error("There was a problem reaching mothership", error);
        });
    }
  }
}
