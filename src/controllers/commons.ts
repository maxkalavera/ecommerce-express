import { buildTarget } from "@/utils/patterns";
import { controllersBaseMixin } from "@/controllers/base";
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
  return buildTarget(target, [controllersBaseMixin, ...mixins]);
};
