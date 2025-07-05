import loadash from 'lodash';
import { APIError, APIErrorParameters } from '@/utils/errors';
import { LayersReturn } from "@/utils/layers/LayersReturn";
import { ReturnData, PayloadSingle, PayloadMany } from '@/types/layers';


export class LayersCore {

  protected _defaults(...args: Parameters<typeof loadash.defaults>) {
    return loadash.defaults(...args)
  }

  protected _defaultsDeep(...args: Parameters<typeof loadash.defaultsDeep>) {
    return loadash.defaultsDeep(...args)
  }

  protected async _withErrors(
    errorParams: APIErrorParameters,
    callback: () => Promise<any>,
    onConclict: 'override' | 'keep' = 'keep'
  ) {
    try {
      return await callback();
    } catch (error) {
      if (error instanceof APIError) {
        if (onConclict === 'keep') {
          throw error;
        } else {
          throw APIError.overrideError(error, errorParams);
        }
      } else {
        throw APIError.fromError(error, errorParams);
      }
    }
  }

  protected _buildError(params: APIErrorParameters) {
    return new APIError(params);
  }

  protected _buildReturn<
    Payload extends PayloadSingle<any> | PayloadMany<any> = PayloadSingle<any> | PayloadMany<any>,
  > (
    returned: ReturnData<Payload>
  ) {
    return new LayersReturn(returned);
  }

};

