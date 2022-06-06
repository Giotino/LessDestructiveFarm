import { Field, ObjectType, Query, Resolver } from 'type-graphql';
import gameManager from '../../game-manager';

@ObjectType()
class GameInfo {
  @Field()
  flagFormat: string;
}

@Resolver()
export class GameResolver {
  @Query(returns => GameInfo)
  async getGameInfo(): Promise<GameInfo> {
    const flagFormat = gameManager.getFlagFormat();
    return { flagFormat };
  }
}
