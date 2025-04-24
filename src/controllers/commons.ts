import { bindContext, buildMixin, buildTarget, extendMixin } from '@/utils/patterns';
import { WithoutContext } from '@/types/patterns';
import { Mixin } from '@/types/patterns';
import { GenericObject } from '@/types/commons';

/*******************************************************************************
 * Controllers
 ******************************************************************************/

export function buildController (
...args: Parameters<typeof buildTarget>
) {
  buildTarget(...args);
}
