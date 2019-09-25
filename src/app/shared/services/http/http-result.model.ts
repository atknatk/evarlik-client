export class KbResultBase {
  status: number;
  label: string;
  message: string;
  objectId: number;
  isSuccess: boolean;

  constructor(options: {
    status?: number,
    label?: string,
    message?: string,
    objectId?: number,
    isSuccess?: boolean,
  } = {}) {
    this.status = options.status;
    this.label = options.label;
    this.message = options.message;
    this.objectId = options.objectId;
    this.isSuccess = options.isSuccess;
  }
}

export class KbResultDataBase<T> extends KbResultBase {
  data: T;

  constructor(options: {
    data?: T,
    status?: number,
    label?: string,
    message?: string,
    objectId?: number,
    isSuccess?: boolean,
  } = {}) {
    super(options);
    this.data = options.data;
  }
}
