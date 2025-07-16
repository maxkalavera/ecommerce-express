import { APIError } from '@/utils/errors';
import { ReturnData, PayloadSingle, PayloadMany } from '@/types/layers';


export class LayersReturn<
  Payload extends PayloadSingle<any> | PayloadMany<any> = PayloadSingle<any> | PayloadMany<any>,
> {
  protected data: ReturnData<Payload>;

  constructor (data: ReturnData<Payload>) {
    this.data = data;
  }

  public async onSuccess<
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

  public onSuccessSync<
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

  public isSuccess() {
    return this.data.success;
  }

  public getPayload () {
    if (this.data.success) {
      return this.data.payload;
    }
    throw new Error("Return object must be successful to get payload");
  }

  public getError () {
    if (!this.data.success) {
      return this.data.error;
    }
    throw new Error("Return object must have failed to get error");
  }
}