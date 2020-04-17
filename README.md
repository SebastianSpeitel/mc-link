# mc-link

Run minecraft commands from outside your world using only datapacks.

## Important Notes:

### Setup

Since mcfunction files can't use the `datapack` command, you need to place two commandblocks into your world for mc-link to work.

The first commandblock is set to `repeat`, `unconditional`, `always active` and runs this command:

```mcfunction
execute if score mc-link:countup vars matches 39.. run datapack disable "file/mc-link-worker"
```

The second commandblock is faced by the first one, is set to `chained`, `unconditional`, `always active` and runs this command:

```mcfunction
datapack enable "file/mc-link-worker"
```

If you want to be able to turn off mc-link using redstone you can set the first one to `needs redstone`.

### Performance

Mc-link reloads a tiny datapack every two seconds to receive new commands, but minecraft reloads much more. These reloads are very noticable.

## Usage

### CLI

`mc-link [wordname]`

```
$ mc-link YourWorldName
Installing datapack... Ready.
> say hi
> difficulty peaceful
```

### Typescript API

```ts
import { McLink } from "mc-link";

const link = new McLink("YourWorldName");

link.run("say hi");
link.run("difficulty peaceful");
```

## ToDos

- [ ] Improve Performance (Maybe file a bugreport)
- [ ] Add ability to place setup commandblocks

## Contributing

Feel free to fork and issue pull requests.
