import { buildMessage, ValidateBy, ValidationOptions } from 'class-validator'
import isUuidValidator from 'validator/lib/isUUID'

export type UUIDVersion = '3' | '4' | '5' | 'all' | 3 | 4 | 5;

export const IS_UUID_OR_BLANK_PARAMETER = 'IsUUIDOrBlankParameter'

export function isUUIDOrBlankParameter(value: unknown, version?: UUIDVersion): boolean {
    return typeof value === 'string' && (isUuidValidator(value, version) || isBlankParameter(value))
}

function isBlankParameter(value: string) {
    return /^{.*}$/.test(value)
}

export function IsUUIDOrBlankParameter(version?: UUIDVersion, validationOptions?: ValidationOptions): PropertyDecorator {
    return ValidateBy(
        {
            name: IS_UUID_OR_BLANK_PARAMETER,
            constraints: [ version ],
            validator: {
                validate: (value, args): boolean => isUUIDOrBlankParameter(value, args.constraints[0]),
                defaultMessage: buildMessage(eachPrefix => eachPrefix + '$property must be a UUID', validationOptions),
            },
        },
        validationOptions
    )
}