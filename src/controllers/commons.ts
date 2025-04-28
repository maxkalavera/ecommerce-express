import { buildTarget } from "@/utils/patterns";
import { Mixin, Target } from "@/types/patterns";

/*******************************************************************************
 * Controllers
 ******************************************************************************/

export function buildController <
  SelfTarget extends Target,
  Mixins extends Mixin<any, any>[]
> (
target: SelfTarget,
mixins: Mixins = [] as any,
) {
  return buildTarget(target, mixins);
};
