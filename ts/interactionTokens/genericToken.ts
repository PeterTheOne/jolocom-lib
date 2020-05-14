import { plainToClass, classToPlain, Expose, Exclude } from 'class-transformer'
import { IGenericAttrs } from './interactionTokens.types'

/**
 * @class
 * Class containing a challenge string and callbackURL for challenge-response did authentication,
 * encodable as a JWT
 * @ignore
 */

@Exclude()
export class Generic<T = {}> {
  private _body: T
  private _callbackURL: string

  /**
   * Get the callback url encoded in the payload
   * @example `console.log(authentication.callbackURL) // 'http://example.com/auth'`
   */

  @Expose()
  get callbackURL(): string {
    return this._callbackURL
  }

  /**
   * Set the callback url encoded in the payload
   * @example `authentication.callbackURL = 'http://example.com/auth'`
   */

  set callbackURL(callbackURL: string) {
    this._callbackURL = callbackURL
  }

  /**
   * Get the description for the required action
   * @example `console.log(authentication.description) // 'Authorization required'`
   */

  @Expose()
  get body(): T {
    return this._body
  }

  /**
   * Set the description for the required action
   * @example `authentication.description = 'Authorization to start the vehicle'`
   */

  set body(body: T) {
    this._body = body
  }

  /**
   * Serializes the {@link Authentication} request / response as JSON-LD
   */

  public toJSON() {
    return classToPlain<IGenericAttrs<T>>(this, { excludePrefixes: ['_'] })
  }

  /**
   * Instantiates a {@link Authentication} from it's JSON form
   * @param json - JSON encoded authentication request / response
   */

  public static fromJSON<R>(json: IGenericAttrs<R>): Generic<R> {
    return plainToClass<Generic<R>, IGenericAttrs<R>>(this, json)
  }
}
