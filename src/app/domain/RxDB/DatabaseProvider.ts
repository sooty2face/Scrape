import { Injectable } from '@angular/core';
import { addRxPlugin, createRxDatabase, RxCollection, RxDatabase, removeRxDatabase } from 'rxdb';
// import idbAdapter from 'pouchdb-adapter-idb';
import toDoSchema from './schemas/todo.schema';
import { Platform } from '@ionic/angular';


@Injectable()
export class DatabaseProvider {

  private database: RxDatabase/*<RxDBContext>*/;
  private dbCollection: RxCollection/*<ToDo>*/;

  public getDatabase() {
    return this.database;
  }

  public getToDoCollection() {
    this.dbCollection = this.database.todoscollection;
    // console.log("getting DB collection --- " + this.dbCollection);
    return this.dbCollection;
  }

  constructor(private platform: Platform) { }

  public async clearDatabase(): Promise<void> {
    if (this.database) {
      await this.database.requestIdlePromise();
      await this.database.remove();
      this.database = null;
      await this.createDB();
    }
  }

  public async createDB() {
    // first remove the database in case there is a change in the schema. For prod mode, just change the version on the schema
    // removeRxDatabase('myrxdb', 'adapter');
    if (this.database) {
      return this.database;
    }

    addRxPlugin(require('pouchdb-adapter-idb'));
    console.log("creating rxdb...");

    // const adapter = this.detectAdaptorToBeUsed();
    // console.log('Adaptor being used: ', adapter);

    try {
      this.database = await createRxDatabase({
        name: 'myrxdb2',           // <- name
        adapter: 'idb',          // <- storage-adapter
        // password: 'test',     // <- password (optional)
        multiInstance: true,         // <- multiInstance (optional, default: true)
        eventReduce: false // <- eventReduce (optional, default: true)
      })/*.then((dbInstance) => {
        console.log("End of promise --- ");
        return dbInstance.todo;
      })*/

      /* With this dump I will know everything that happends in the DB */
      this.database.dump().then(console.log);
    }
    catch (error) {
      console.error(error);
    }

    await this.addDBCollection()

    return this.database;
  }

  async addDBCollection() {
    console.log('creating ToDo collection ...' + this.getToDoCollection());
    if (this.getToDoCollection()) {
      console.log('ToDo collection already exist...');
      return;
    }
    const myCollection = await this.database.addCollections({
      todoscollection: {
        schema: toDoSchema,
        migrationStrategies: {
          // 1: () => null
          // 1 means, this transforms data from version 0 to version 1
          // 1: function (oldDoc) {
          //   //oldDoc.properties = "";  //new Date(oldDoc.time).getTime(); // string to unix
          //   return oldDoc;
          // },
          // 2: function (oldDoc) {
          //   //oldDoc.properties = "";  //new Date(oldDoc.time).getTime(); // string to unix
          //   return oldDoc;
          // }
        }
      }
    });
    // console.log("Collection from rxdb-create: " + myCollection.todos.$.subscribe(res => console.log(res.collectionName)));
    console.log('created collection');


    return myCollection;
  }

  // private detectAdaptorToBeUsed(): string | 'idb' {
  //   if (this.platform.isBrowser) {
  //     addRxPlugin(idbAdapter);
  //     return 'idb';
  //   } else {
  //     return 'No idea what plugin to use...';
  //   }
  // }

}