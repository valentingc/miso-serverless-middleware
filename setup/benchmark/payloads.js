function generateStringOfSize(size) {
  const match = size.match(/^([\d.]+)([a-zA-Z]+)$/);

  if (!match) {
    throw new Error(
      'Invalid input format. Use a format like "1mb" or "512kb". Supported units: b, kb, mb, gb',
    );
  }

  const sizeValue = parseFloat(match[1]);
  const unit = match[2].toLowerCase();

  const unitMultipliers = {
    b: 1,
    kb: 1024,
    mb: 1024 * 1024,
    gb: 1024 * 1024 * 1024,
  };

  if (!unitMultipliers[unit]) {
    throw new Error('Invalid unit. Use units "b," "kb," "mb," or "gb."');
  }

  const totalBytes = sizeValue * unitMultipliers[unit];
  const buffer = Buffer.alloc(totalBytes);
  return buffer.toString();
}

export const INIT_OPERATIONS_REQUIRED = {
  functions: {
    register: [
      {
        payload: {
          operation: 'init',
          value: 'asdf',
          includeValueInResponse: true,
        },
      },
    ],
    counter: [
      {
        payload: {
          operation: 'init',
          value: 1000,
          includeValueInResponse: false,
        },
      },
    ],
  },
};

export const PAYLOADS = {
  functions: {
    counter: {
      'pncounter-increase': {
        operation: 'pncounter-increase',
        includeValueInResponse: true,
        crdtName: 'pnCounter-eval',
      },
      'pncounter-decrease': {
        operation: 'pncounter-decrease',
        includeValueInResponse: true,
        crdtName: 'pnCounter-eval',
      },
      'pncounter-getValue': {
        operation: 'pncounter-getValue',
        includeValueInResponse: true,
        crdtName: 'pnCounter-eval',
      },
    },
    register: {
      'mvregister-concat-10kb': {
        operation: 'mvregister-concat',
        size: '10kb',
        append: ', test, ',
        includeValueInResponse: false,
      },
      'mvregister-concat-0.01mb': {
        operation: 'mvregister-concat',
        size: '0.01mb',
        append: ', test, ',
        includeValueInResponse: false,
      },
      'mvregister-concat-1mb': {
        operation: 'mvregister-concat',
        size: '1mb',
        append: ', test, ',
        includeValueInResponse: false,
      },
      defaultPayload: {
        operation: 'mvregister',
        size: '0.01mb',
        append: ', test, ',
        includeValueInResponse: false,
      },
    },
  },
};
