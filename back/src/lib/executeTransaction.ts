import {
  DeleteResult,
  InsertResult,
  QueryBuilder,
  QueryRunner,
  UpdateResult,
} from 'typeorm';
import { TransactionException } from '../exception/Exception';

/**
 * make transaction and exeute query
 * fail - rollback
 * success - commit
 * always release connection
 * @param runner query runner
 * @param queries queries to run
 * @returns query results
 */
export const executeTransaction = async (
  runner: QueryRunner,
  ...queries: QueryBuilder<any>[]
): Promise<(InsertResult | UpdateResult | DeleteResult)[]> => {
  const results: (InsertResult | UpdateResult | DeleteResult)[] = [];

  await runner.connect();
  await runner.startTransaction();
  try {
    for (const query of queries) results.push(await query.execute());
    await runner.commitTransaction();

    return results;
  } catch (error) {
    await runner.rollbackTransaction();
    throw new TransactionException();
  } finally {
    await runner.release();
  }
};
