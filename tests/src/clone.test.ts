import { assert, test } from "vitest";

import { runScenario, pause, CallableCell } from "@holochain/tryorama";

test("call hello from the provisioned cell and clone it", async () => {
  await runScenario(async (scenario) => {
    // Construct proper paths for your app.
    // This assumes app bundle created by the `hc app pack` command.
    const testAppPath = process.cwd() + "/../workdir/forum.happ";

    // Set up the app to be installed
    const appSource = { appBundleSource: { path: testAppPath } };

    // Add 2 players with the test app to the Scenario. The returned players
    // can be destructured.
    const [alice] = await scenario.addPlayersWithApps([appSource]);

    // Shortcut peer discovery through gossip and register all agents in every
    // conductor of the scenario.
    await scenario.shareAllAgents();

    // Bob gets all posts
    let hello: string = await alice.conductor.appAgentWs().callZome({
      role_name: "forum",
      zome_name: "posts",
      fn_name: "hello",
      payload: null,
    });
    assert.equal(hello, "hello");

    const cellInfo = await alice.conductor.appAgentWs().createCloneCell({
      modifiers: {
        network_seed: "clone",
      },
      role_name: "forum",
    });

    console.log("CELL INFO: ", JSON.stringify(cellInfo));

    const appInfo = await alice.conductor.appAgentWs().appInfo();

    console.log("APP INFO: ", JSON.stringify(appInfo));

    hello = await alice.conductor.appAgentWs().callZome({
      cell_id: cellInfo.cell_id,
      zome_name: "posts",
      fn_name: "hello",
      payload: null,
    });
    assert.equal(hello, "hello");
  });
});

test("call hello from the provisioned cell, clone it, and call hello again", async () => {
  await runScenario(async (scenario) => {
    // Construct proper paths for your app.
    // This assumes app bundle created by the `hc app pack` command.
    const testAppPath = process.cwd() + "/../workdir/forum.happ";

    // Set up the app to be installed
    const appSource = { appBundleSource: { path: testAppPath } };

    // Add 2 players with the test app to the Scenario. The returned players
    // can be destructured.
    const [alice] = await scenario.addPlayersWithApps([appSource]);

    // Shortcut peer discovery through gossip and register all agents in every
    // conductor of the scenario.
    await scenario.shareAllAgents();

    // Bob gets all posts
    let hello: string = await alice.conductor.appAgentWs().callZome({
      role_name: "forum",
      zome_name: "posts",
      fn_name: "hello",
      payload: null,
    });
    assert.equal(hello, "hello");

    const cellInfo = await alice.conductor.appAgentWs().createCloneCell({
      modifiers: {
        network_seed: "clone",
      },
      role_name: "forum",
    });

    console.log("CELL INFO: ", JSON.stringify(cellInfo));

    const appInfo = await alice.conductor.appAgentWs().appInfo();

    console.log("APP INFO: ", JSON.stringify(appInfo));

    hello = await alice.conductor.appAgentWs().callZome({
      cell_id: cellInfo.cell_id,
      zome_name: "posts",
      fn_name: "hello",
      payload: null,
    });
    assert.equal(hello, "hello");
  });
});
