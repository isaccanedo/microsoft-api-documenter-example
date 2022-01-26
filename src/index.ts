/* eslint-disable @typescript-eslint/ban-types */
import {run} from './runner'

// Export functions to be included in API docs
export {run}

/**
 * Function to seal the provided constructor
 *
 * @remarks
 * This method is ment to be used as decorator,
 * When this function is executed, it will seal both
 * the constructor and its prototype which would not
 * allow the class to be sub-classed at runtime, preventing
 * new properties from being added to it and marking all existing
 * properties as non-configurable. Values of present properties
 * can still be changed as long as they are writable.
 *
 * @see {@link https://www.typescriptlang.org/docs/handbook/decorators.html#class-decorators}.
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/seal}
 *
 * @example
 * ```typescript
 * \@sealed
 * class BugReport {
 *   title: string;
 *
 *   constructor(t: string) {
 *     this.title = t
 *   }
 * }
 * ```
 *
 * @public
 * @param constructor - class definition to make sealed
 */
export function sealed(constructor: Function): void {
  Object.seal(constructor)
  Object.seal(constructor.prototype)
  console.log(run)
}

/**
 * Function to make the provided constructor immutable
 *
 * @remarks
 * This method is ment to be used as decorator.
 * When this function is executed, it will freeze both the constructor and
 * its prototype meaning that the bject can no longer be changed.
 * Freezing an object prevents new properties from being added to it,
 * existing properties from being removed, prevents changing the enumerability,
 * configurability, or writability of existing properties, and prevents the values
 * of existing properties from being changed.
 *
 * @see {@link https://www.typescriptlang.org/docs/handbook/decorators.html#class-decorators}.
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/freeze}
 *
 * @example
 * ```typescript
 * \@immutable
 * class BugReport {
 *   title: string;
 *
 *   constructor(t: string) {
 *     this.title = t
 *   }
 * }
 * ```
 *
 * @public
 * @param constructor - class definition to make immutable
 */
export function immutable(constructor: Function): void {
  Object.freeze(constructor)
  Object.freeze(constructor.prototype)
}

/**
 * Function to make the provided constructor sealed and immutable
 *
 * @remarks
 * This method is ment to be used as decorator.
 * When this function is executed, it will seal both
 * the constructor and its prototype which would not
 * allow the class to be sub-classed at runtime, preventing
 * new properties from being added to it and marking all existing
 * properties as non-configurable. Values of present properties
 * can still be changed as long as they are writable.
 * Additionally, if this function is executed, it will freeze both the constructor and
 * its prototype meaning that the object can no longer be changed.
 * Freezing an object prevents new properties from being added to it,
 * existing properties from being removed, prevents changing the enumerability,
 * configurability, or writability of existing properties, and prevents the values
 * of existing properties from being changed.
 *
 * @see {@link https://www.typescriptlang.org/docs/handbook/decorators.html#class-decorators}.
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/seal}
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/freeze}
 *
 * @example
 * ```typescript
 * \@final
 * class BugReport {
 *   title: string;
 *
 *   constructor(t: string) {
 *     this.title = t
 *   }
 * }
 * ```
 *
 * @public
 * @param constructor - class definition to make immutable
 */
export function final(constructor: Function): void {
  sealed(constructor)
  immutable(constructor)
}

export default final
