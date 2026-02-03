import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ async: false })
export class IsIdentifierConstraint implements ValidatorConstraintInterface {
  validate(identifier: string) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\+?[0-9]{10,15}$/;
    
    return emailRegex.test(identifier) || phoneRegex.test(identifier);
  }

  defaultMessage() {
    return 'Identifier must be a valid email or phone number';
  }
}

export function IsIdentifier(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsIdentifierConstraint,
    });
  };
}