/*
 * Copyright (c) 2020-present Lawly AB. All Rights Reserved.
 * Author: Mehdi Tirgar <mehdi.tirgar@wearelevels.com> 2020-2021
 *
 */

enum LogLevel {
  error = 1,
  warn = 2,
  log = 3,
  info = 3,
  debug = 4,
  trace = 5,
}

type Logger = {
  [x in keyof typeof LogLevel]: (...args: any[]) => boolean;
};

const envLogLevel = Number(process.env.LAWLY_LOG_LEVEL);
const appLogLevel = isFinite(envLogLevel) ? envLogLevel : 1;

const logIcons = [128308, 128308, 128993, 128994, 128995, 128309];

const createLogger =
  (level: LogLevel, loggerId?: string) =>
  (...args): boolean => {
    if (appLogLevel < level) {
      return false;
    }

    const logMethod = LogLevel[level] ?? LogLevel.info;
    const logIcon = logIcons[level];
    const iconChar = logIcon ? String.fromCodePoint(logIcon) : '';
    const loggerName = loggerId ? `[${loggerId}]` : '';
    args.unshift(`${iconChar} ${loggerName}`);
    // eslint-disable-next-line no-console
    console[logMethod](...args);

    return true;
  };

export const getLogger = (loggerId?: string) =>
  ({
    error: createLogger(LogLevel.error, loggerId),
    warn: createLogger(LogLevel.warn, loggerId),
    log: createLogger(LogLevel.log, loggerId),
    info: createLogger(LogLevel.info, loggerId),
    debug: createLogger(LogLevel.debug, loggerId),
    trace: createLogger(LogLevel.trace, loggerId),
  } as Logger);

export const logger = getLogger();
