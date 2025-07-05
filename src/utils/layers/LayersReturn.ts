import { APIError } from '@/utils/errors';
import { ReturnData, PayloadSingle, PayloadMany } from '@/types/layers';


export class LayersReturn<
  Payload extends PayloadSingle<any> | PayloadMany<any> = PayloadSingle<any> | PayloadMany<any>,
> {
  protected data: ReturnData<Payload>;

  constructor (data: ReturnData<Payload>) {
    this.data = data;
  }

  async onSuccess<
    Return extends any
  > (
    callback: (payload: Payload) => Promise<Return>
  ): Promise<void | Return>
  {
    if (this.data.success) {
      return await callback(this.data.payload);
    }
    return;
  }

  onSuccessSync<
    Return extends any
  > (
    callback: (payload: Payload) => Return
  ): void | Return 
  {
    if (this.data.success) {
      callback(this.data.payload);
    }
    return;
  }

  isSuccess() {
    return this.data.success;
  }

  getPayload () {
    if (this.data.success) {
      return this.data.payload;
    }
    throw ("Return object must be successful to get payload");
  }

  getError () {
    if (!this.data.success) {
      return this.data.error;
    }
    throw ("Return object must have failed to get error");
  }
}