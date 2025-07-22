import loadash from 'lodash';
import { APIError, APIErrorParameters } from '@/utils/errors';
import { LayersReturn } from "@/utils/layers/LayersReturn";
import { ReturnData, PayloadSingle, PayloadMany } from '@/types/layers';
import { validate, coherce } from '@/utils/validators';


export class LayersCore {

  protected defaults(...args: Parameters<typeof loadash.defaults>) {
    return loadash.defaults(...args)
  }

  protected defaultsDeep(...args: Parameters<typeof loadash.defaultsDeep>) {
    return loadash.defaultsDeep(...args)
  }

  protected async withErrors(
    errorParams: APIErrorParameters,
    callback: () => Promise<any>,
  ) {
    try {
      return await callback();
    } catch (error) {
      throw APIError.fromError(error, errorParams);
    }
  }

  protected buildError(params: APIErrorParameters) {
    return new APIError(params);
  }

  protected buildReturn<
    Payload extends PayloadSingle<any> | PayloadMany<any> = PayloadSingle<any> | PayloadMany<any>,
  > (
    returned: ReturnData<Payload>
  ) {
    return new LayersReturn(returned);
  }

  protected validate(
    ...args: Parameters<typeof validate>
  ) {
    return validate(...args);
  }

  protected coherce(
    ...args: Parameters<typeof coherce>
  ) {
    return coherce(...args);
  }

};

