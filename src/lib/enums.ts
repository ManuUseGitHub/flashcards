import { PAD_DIRECTION } from './strings';

export const getEnumName = (_enum: any, value: any) => _enum[value];
export const parsePadDirection = (paddingDirection: any): PAD_DIRECTION => {
  return paddingDirection == 'left'
    ? PAD_DIRECTION.LEFT
    : paddingDirection == 'right'
    ? PAD_DIRECTION.RIGHT
    : paddingDirection == 'center'
    ? PAD_DIRECTION.CENTER
    : PAD_DIRECTION.NONE;
};
