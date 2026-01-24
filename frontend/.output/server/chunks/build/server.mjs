import process from 'node:process';globalThis._importMeta_=globalThis._importMeta_||{url:"file:///_entry.js",env:process.env};import { hasInjectionContext, getCurrentInstance, defineComponent, useSSRContext, createApp, mergeProps, ref, provide, toRef, onErrorCaptured, onServerPrefetch, unref, createVNode, resolveDynamicComponent, shallowReactive, reactive, effectScope, computed, h, isReadonly, isRef, isShallow, isReactive, toRaw, inject, defineAsyncComponent, getCurrentScope } from 'vue';
import { i as hasProtocol, k as isScriptProtocol, l as joinURL, w as withQuery, s as sanitizeStatusCode, m as getContext, $ as $fetch, n as createHooks, c as createError$1, o as isEqual, p as stringifyParsedURL, q as stringifyQuery, r as parseQuery, t as toRouteMatcher, v as createRouter, x as defu } from '../nitro/nitro.mjs';
import { b as baseURL } from '../routes/renderer.mjs';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderList, ssrRenderClass, ssrRenderStyle, ssrRenderAttr, ssrRenderComponent, ssrRenderSuspense, ssrRenderVNode } from 'vue/server-renderer';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/utils';

if (!globalThis.$fetch) {
  globalThis.$fetch = $fetch.create({
    baseURL: baseURL()
  });
}
if (!("global" in globalThis)) {
  globalThis.global = globalThis;
}
const nuxtLinkDefaults = { "componentName": "NuxtLink" };
const appId = "nuxt-app";
function getNuxtAppCtx(id = appId) {
  return getContext(id, {
    asyncContext: false
  });
}
const NuxtPluginIndicator = "__nuxt_plugin";
function createNuxtApp(options) {
  let hydratingCount = 0;
  const nuxtApp = {
    _id: options.id || appId || "nuxt-app",
    _scope: effectScope(),
    provide: void 0,
    versions: {
      get nuxt() {
        return "4.2.1";
      },
      get vue() {
        return nuxtApp.vueApp.version;
      }
    },
    payload: shallowReactive({
      ...options.ssrContext?.payload || {},
      data: shallowReactive({}),
      state: reactive({}),
      once: /* @__PURE__ */ new Set(),
      _errors: shallowReactive({})
    }),
    static: {
      data: {}
    },
    runWithContext(fn) {
      if (nuxtApp._scope.active && !getCurrentScope()) {
        return nuxtApp._scope.run(() => callWithNuxt(nuxtApp, fn));
      }
      return callWithNuxt(nuxtApp, fn);
    },
    isHydrating: false,
    deferHydration() {
      if (!nuxtApp.isHydrating) {
        return () => {
        };
      }
      hydratingCount++;
      let called = false;
      return () => {
        if (called) {
          return;
        }
        called = true;
        hydratingCount--;
        if (hydratingCount === 0) {
          nuxtApp.isHydrating = false;
          return nuxtApp.callHook("app:suspense:resolve");
        }
      };
    },
    _asyncDataPromises: {},
    _asyncData: shallowReactive({}),
    _payloadRevivers: {},
    ...options
  };
  {
    nuxtApp.payload.serverRendered = true;
  }
  if (nuxtApp.ssrContext) {
    nuxtApp.payload.path = nuxtApp.ssrContext.url;
    nuxtApp.ssrContext.nuxt = nuxtApp;
    nuxtApp.ssrContext.payload = nuxtApp.payload;
    nuxtApp.ssrContext.config = {
      public: nuxtApp.ssrContext.runtimeConfig.public,
      app: nuxtApp.ssrContext.runtimeConfig.app
    };
  }
  nuxtApp.hooks = createHooks();
  nuxtApp.hook = nuxtApp.hooks.hook;
  {
    const contextCaller = async function(hooks, args) {
      for (const hook of hooks) {
        await nuxtApp.runWithContext(() => hook(...args));
      }
    };
    nuxtApp.hooks.callHook = (name, ...args) => nuxtApp.hooks.callHookWith(contextCaller, name, ...args);
  }
  nuxtApp.callHook = nuxtApp.hooks.callHook;
  nuxtApp.provide = (name, value) => {
    const $name = "$" + name;
    defineGetter(nuxtApp, $name, value);
    defineGetter(nuxtApp.vueApp.config.globalProperties, $name, value);
  };
  defineGetter(nuxtApp.vueApp, "$nuxt", nuxtApp);
  defineGetter(nuxtApp.vueApp.config.globalProperties, "$nuxt", nuxtApp);
  const runtimeConfig = options.ssrContext.runtimeConfig;
  nuxtApp.provide("config", runtimeConfig);
  return nuxtApp;
}
function registerPluginHooks(nuxtApp, plugin) {
  if (plugin.hooks) {
    nuxtApp.hooks.addHooks(plugin.hooks);
  }
}
async function applyPlugin(nuxtApp, plugin) {
  if (typeof plugin === "function") {
    const { provide: provide2 } = await nuxtApp.runWithContext(() => plugin(nuxtApp)) || {};
    if (provide2 && typeof provide2 === "object") {
      for (const key in provide2) {
        nuxtApp.provide(key, provide2[key]);
      }
    }
  }
}
async function applyPlugins(nuxtApp, plugins2) {
  const resolvedPlugins = /* @__PURE__ */ new Set();
  const unresolvedPlugins = [];
  const parallels = [];
  let error = void 0;
  let promiseDepth = 0;
  async function executePlugin(plugin) {
    const unresolvedPluginsForThisPlugin = plugin.dependsOn?.filter((name) => plugins2.some((p) => p._name === name) && !resolvedPlugins.has(name)) ?? [];
    if (unresolvedPluginsForThisPlugin.length > 0) {
      unresolvedPlugins.push([new Set(unresolvedPluginsForThisPlugin), plugin]);
    } else {
      const promise = applyPlugin(nuxtApp, plugin).then(async () => {
        if (plugin._name) {
          resolvedPlugins.add(plugin._name);
          await Promise.all(unresolvedPlugins.map(async ([dependsOn, unexecutedPlugin]) => {
            if (dependsOn.has(plugin._name)) {
              dependsOn.delete(plugin._name);
              if (dependsOn.size === 0) {
                promiseDepth++;
                await executePlugin(unexecutedPlugin);
              }
            }
          }));
        }
      }).catch((e) => {
        if (!plugin.parallel && !nuxtApp.payload.error) {
          throw e;
        }
        error ||= e;
      });
      if (plugin.parallel) {
        parallels.push(promise);
      } else {
        await promise;
      }
    }
  }
  for (const plugin of plugins2) {
    if (nuxtApp.ssrContext?.islandContext && plugin.env?.islands === false) {
      continue;
    }
    registerPluginHooks(nuxtApp, plugin);
  }
  for (const plugin of plugins2) {
    if (nuxtApp.ssrContext?.islandContext && plugin.env?.islands === false) {
      continue;
    }
    await executePlugin(plugin);
  }
  await Promise.all(parallels);
  if (promiseDepth) {
    for (let i = 0; i < promiseDepth; i++) {
      await Promise.all(parallels);
    }
  }
  if (error) {
    throw nuxtApp.payload.error || error;
  }
}
// @__NO_SIDE_EFFECTS__
function defineNuxtPlugin(plugin) {
  if (typeof plugin === "function") {
    return plugin;
  }
  const _name = plugin._name || plugin.name;
  delete plugin.name;
  return Object.assign(plugin.setup || (() => {
  }), plugin, { [NuxtPluginIndicator]: true, _name });
}
function callWithNuxt(nuxt, setup, args) {
  const fn = () => setup();
  const nuxtAppCtx = getNuxtAppCtx(nuxt._id);
  {
    return nuxt.vueApp.runWithContext(() => nuxtAppCtx.callAsync(nuxt, fn));
  }
}
function tryUseNuxtApp(id) {
  let nuxtAppInstance;
  if (hasInjectionContext()) {
    nuxtAppInstance = getCurrentInstance()?.appContext.app.$nuxt;
  }
  nuxtAppInstance ||= getNuxtAppCtx(id).tryUse();
  return nuxtAppInstance || null;
}
function useNuxtApp(id) {
  const nuxtAppInstance = tryUseNuxtApp(id);
  if (!nuxtAppInstance) {
    {
      throw new Error("[nuxt] instance unavailable");
    }
  }
  return nuxtAppInstance;
}
// @__NO_SIDE_EFFECTS__
function useRuntimeConfig(_event) {
  return useNuxtApp().$config;
}
function defineGetter(obj, key, val) {
  Object.defineProperty(obj, key, { get: () => val });
}
const PageRouteSymbol = Symbol("route");
globalThis._importMeta_.url.replace(/\/app\/.*$/, "/");
const useRouter = () => {
  return useNuxtApp()?.$router;
};
const useRoute = () => {
  if (hasInjectionContext()) {
    return inject(PageRouteSymbol, useNuxtApp()._route);
  }
  return useNuxtApp()._route;
};
// @__NO_SIDE_EFFECTS__
function defineNuxtRouteMiddleware(middleware) {
  return middleware;
}
const isProcessingMiddleware = () => {
  try {
    if (useNuxtApp()._processingMiddleware) {
      return true;
    }
  } catch {
    return false;
  }
  return false;
};
const URL_QUOTE_RE = /"/g;
const navigateTo = (to, options) => {
  to ||= "/";
  const toPath = typeof to === "string" ? to : "path" in to ? resolveRouteObject(to) : useRouter().resolve(to).href;
  const isExternalHost = hasProtocol(toPath, { acceptRelative: true });
  const isExternal = options?.external || isExternalHost;
  if (isExternal) {
    if (!options?.external) {
      throw new Error("Navigating to an external URL is not allowed by default. Use `navigateTo(url, { external: true })`.");
    }
    const { protocol } = new URL(toPath, "http://localhost");
    if (protocol && isScriptProtocol(protocol)) {
      throw new Error(`Cannot navigate to a URL with '${protocol}' protocol.`);
    }
  }
  const inMiddleware = isProcessingMiddleware();
  const router = useRouter();
  const nuxtApp = useNuxtApp();
  {
    if (nuxtApp.ssrContext) {
      const fullPath = typeof to === "string" || isExternal ? toPath : router.resolve(to).fullPath || "/";
      const location2 = isExternal ? toPath : joinURL((/* @__PURE__ */ useRuntimeConfig()).app.baseURL, fullPath);
      const redirect = async function(response) {
        await nuxtApp.callHook("app:redirected");
        const encodedLoc = location2.replace(URL_QUOTE_RE, "%22");
        const encodedHeader = encodeURL(location2, isExternalHost);
        nuxtApp.ssrContext._renderResponse = {
          statusCode: sanitizeStatusCode(options?.redirectCode || 302, 302),
          body: `<!DOCTYPE html><html><head><meta http-equiv="refresh" content="0; url=${encodedLoc}"></head></html>`,
          headers: { location: encodedHeader }
        };
        return response;
      };
      if (!isExternal && inMiddleware) {
        router.afterEach((final) => final.fullPath === fullPath ? redirect(false) : void 0);
        return to;
      }
      return redirect(!inMiddleware ? void 0 : (
        /* abort route navigation */
        false
      ));
    }
  }
  if (isExternal) {
    nuxtApp._scope.stop();
    if (options?.replace) {
      (void 0).replace(toPath);
    } else {
      (void 0).href = toPath;
    }
    if (inMiddleware) {
      if (!nuxtApp.isHydrating) {
        return false;
      }
      return new Promise(() => {
      });
    }
    return Promise.resolve();
  }
  return options?.replace ? router.replace(to) : router.push(to);
};
function resolveRouteObject(to) {
  return withQuery(to.path || "", to.query || {}) + (to.hash || "");
}
function encodeURL(location2, isExternalHost = false) {
  const url = new URL(location2, "http://localhost");
  if (!isExternalHost) {
    return url.pathname + url.search + url.hash;
  }
  if (location2.startsWith("//")) {
    return url.toString().replace(url.protocol, "");
  }
  return url.toString();
}
const NUXT_ERROR_SIGNATURE = "__nuxt_error";
const useError = /* @__NO_SIDE_EFFECTS__ */ () => toRef(useNuxtApp().payload, "error");
const showError = (error) => {
  const nuxtError = createError(error);
  try {
    const error2 = /* @__PURE__ */ useError();
    if (false) ;
    error2.value ||= nuxtError;
  } catch {
    throw nuxtError;
  }
  return nuxtError;
};
const isNuxtError = (error) => !!error && typeof error === "object" && NUXT_ERROR_SIGNATURE in error;
const createError = (error) => {
  const nuxtError = createError$1(error);
  Object.defineProperty(nuxtError, NUXT_ERROR_SIGNATURE, {
    value: true,
    configurable: false,
    writable: false
  });
  return nuxtError;
};
const unhead_k2P3m_ZDyjlr2mMYnoDPwavjsDN8hBlk9cFai0bbopU = /* @__PURE__ */ defineNuxtPlugin({
  name: "nuxt:head",
  enforce: "pre",
  setup(nuxtApp) {
    const head = nuxtApp.ssrContext.head;
    nuxtApp.vueApp.use(head);
  }
});
async function getRouteRules(arg) {
  const path = typeof arg === "string" ? arg : arg.path;
  {
    useNuxtApp().ssrContext._preloadManifest = true;
    const _routeRulesMatcher = toRouteMatcher(
      createRouter({ routes: (/* @__PURE__ */ useRuntimeConfig()).nitro.routeRules })
    );
    return defu({}, ..._routeRulesMatcher.matchAll(path).reverse());
  }
}
const manifest_45route_45rule = /* @__PURE__ */ defineNuxtRouteMiddleware(async (to) => {
  {
    return;
  }
});
const globalMiddleware = [
  manifest_45route_45rule
];
function getRouteFromPath(fullPath) {
  const route = fullPath && typeof fullPath === "object" ? fullPath : {};
  if (typeof fullPath === "object") {
    fullPath = stringifyParsedURL({
      pathname: fullPath.path || "",
      search: stringifyQuery(fullPath.query || {}),
      hash: fullPath.hash || ""
    });
  }
  const url = new URL(fullPath.toString(), "http://localhost");
  return {
    path: url.pathname,
    fullPath,
    query: parseQuery(url.search),
    hash: url.hash,
    // stub properties for compat with vue-router
    params: route.params || {},
    name: void 0,
    matched: route.matched || [],
    redirectedFrom: void 0,
    meta: route.meta || {},
    href: fullPath
  };
}
const router_DclsWNDeVV7SyG4lslgLnjbQUK1ws8wgf2FHaAbo7Cw = /* @__PURE__ */ defineNuxtPlugin({
  name: "nuxt:router",
  enforce: "pre",
  setup(nuxtApp) {
    const initialURL = nuxtApp.ssrContext.url;
    const routes = [];
    const hooks = {
      "navigate:before": [],
      "resolve:before": [],
      "navigate:after": [],
      "error": []
    };
    const registerHook = (hook, guard) => {
      hooks[hook].push(guard);
      return () => hooks[hook].splice(hooks[hook].indexOf(guard), 1);
    };
    (/* @__PURE__ */ useRuntimeConfig()).app.baseURL;
    const route = reactive(getRouteFromPath(initialURL));
    async function handleNavigation(url, replace) {
      try {
        const to = getRouteFromPath(url);
        for (const middleware of hooks["navigate:before"]) {
          const result = await middleware(to, route);
          if (result === false || result instanceof Error) {
            return;
          }
          if (typeof result === "string" && result.length) {
            return handleNavigation(result, true);
          }
        }
        for (const handler of hooks["resolve:before"]) {
          await handler(to, route);
        }
        Object.assign(route, to);
        if (false) ;
        for (const middleware of hooks["navigate:after"]) {
          await middleware(to, route);
        }
      } catch (err) {
        for (const handler of hooks.error) {
          await handler(err);
        }
      }
    }
    const currentRoute = computed(() => route);
    const router = {
      currentRoute,
      isReady: () => Promise.resolve(),
      // These options provide a similar API to vue-router but have no effect
      options: {},
      install: () => Promise.resolve(),
      // Navigation
      push: (url) => handleNavigation(url),
      replace: (url) => handleNavigation(url),
      back: () => (void 0).history.go(-1),
      go: (delta) => (void 0).history.go(delta),
      forward: () => (void 0).history.go(1),
      // Guards
      beforeResolve: (guard) => registerHook("resolve:before", guard),
      beforeEach: (guard) => registerHook("navigate:before", guard),
      afterEach: (guard) => registerHook("navigate:after", guard),
      onError: (handler) => registerHook("error", handler),
      // Routes
      resolve: getRouteFromPath,
      addRoute: (parentName, route2) => {
        routes.push(route2);
      },
      getRoutes: () => routes,
      hasRoute: (name) => routes.some((route2) => route2.name === name),
      removeRoute: (name) => {
        const index = routes.findIndex((route2) => route2.name === name);
        if (index !== -1) {
          routes.splice(index, 1);
        }
      }
    };
    nuxtApp.vueApp.component("RouterLink", defineComponent({
      functional: true,
      props: {
        to: {
          type: String,
          required: true
        },
        custom: Boolean,
        replace: Boolean,
        // Not implemented
        activeClass: String,
        exactActiveClass: String,
        ariaCurrentValue: String
      },
      setup: (props, { slots }) => {
        const navigate = () => handleNavigation(props.to, props.replace);
        return () => {
          const route2 = router.resolve(props.to);
          return props.custom ? slots.default?.({ href: props.to, navigate, route: route2 }) : h("a", { href: props.to, onClick: (e) => {
            e.preventDefault();
            return navigate();
          } }, slots);
        };
      }
    }));
    nuxtApp._route = route;
    nuxtApp._middleware ||= {
      global: [],
      named: {}
    };
    const initialLayout = nuxtApp.payload.state._layout;
    nuxtApp.hooks.hookOnce("app:created", async () => {
      router.beforeEach(async (to, from) => {
        to.meta = reactive(to.meta || {});
        if (nuxtApp.isHydrating && initialLayout && !isReadonly(to.meta.layout)) {
          to.meta.layout = initialLayout;
        }
        nuxtApp._processingMiddleware = true;
        if (!nuxtApp.ssrContext?.islandContext) {
          const middlewareEntries = /* @__PURE__ */ new Set([...globalMiddleware, ...nuxtApp._middleware.global]);
          {
            const routeRules = await nuxtApp.runWithContext(() => getRouteRules({ path: to.path }));
            if (routeRules.appMiddleware) {
              for (const key in routeRules.appMiddleware) {
                const guard = nuxtApp._middleware.named[key];
                if (!guard) {
                  return;
                }
                if (routeRules.appMiddleware[key]) {
                  middlewareEntries.add(guard);
                } else {
                  middlewareEntries.delete(guard);
                }
              }
            }
          }
          for (const middleware of middlewareEntries) {
            const result = await nuxtApp.runWithContext(() => middleware(to, from));
            {
              if (result === false || result instanceof Error) {
                const error = result || createError$1({
                  statusCode: 404,
                  statusMessage: `Page Not Found: ${initialURL}`,
                  data: {
                    path: initialURL
                  }
                });
                delete nuxtApp._processingMiddleware;
                return nuxtApp.runWithContext(() => showError(error));
              }
            }
            if (result === true) {
              continue;
            }
            if (result || result === false) {
              return result;
            }
          }
        }
      });
      router.afterEach(() => {
        delete nuxtApp._processingMiddleware;
      });
      await router.replace(initialURL);
      if (!isEqual(route.fullPath, initialURL)) {
        await nuxtApp.runWithContext(() => navigateTo(route.fullPath));
      }
    });
    return {
      provide: {
        route,
        router
      }
    };
  }
});
function definePayloadReducer(name, reduce) {
  {
    useNuxtApp().ssrContext._payloadReducers[name] = reduce;
  }
}
const reducers = [
  ["NuxtError", (data) => isNuxtError(data) && data.toJSON()],
  ["EmptyShallowRef", (data) => isRef(data) && isShallow(data) && !data.value && (typeof data.value === "bigint" ? "0n" : JSON.stringify(data.value) || "_")],
  ["EmptyRef", (data) => isRef(data) && !data.value && (typeof data.value === "bigint" ? "0n" : JSON.stringify(data.value) || "_")],
  ["ShallowRef", (data) => isRef(data) && isShallow(data) && data.value],
  ["ShallowReactive", (data) => isReactive(data) && isShallow(data) && toRaw(data)],
  ["Ref", (data) => isRef(data) && data.value],
  ["Reactive", (data) => isReactive(data) && toRaw(data)]
];
const revive_payload_server_MVtmlZaQpj6ApFmshWfUWl5PehCebzaBf2NuRMiIbms = /* @__PURE__ */ defineNuxtPlugin({
  name: "nuxt:revive-payload:server",
  setup() {
    for (const [reducer, fn] of reducers) {
      definePayloadReducer(reducer, fn);
    }
  }
});
const components_plugin_4kY4pyzJIYX99vmMAAIorFf3CnAaptHitJgf7JxiED8 = /* @__PURE__ */ defineNuxtPlugin({
  name: "nuxt:global-components"
});
const plugins = [
  unhead_k2P3m_ZDyjlr2mMYnoDPwavjsDN8hBlk9cFai0bbopU,
  router_DclsWNDeVV7SyG4lslgLnjbQUK1ws8wgf2FHaAbo7Cw,
  revive_payload_server_MVtmlZaQpj6ApFmshWfUWl5PehCebzaBf2NuRMiIbms,
  components_plugin_4kY4pyzJIYX99vmMAAIorFf3CnAaptHitJgf7JxiED8
];
const _export_sfc = (sfc, props) => {
  const target = sfc.__vccOpts || sfc;
  for (const [key, val] of props) {
    target[key] = val;
  }
  return target;
};
const _sfc_main$8 = {};
function _sfc_ssrRender$4(_ctx, _push, _parent, _attrs) {
  _push(`<header${ssrRenderAttrs(mergeProps({ class: "bg-gray-800 shadow-lg sticky top-0 z-50 border-b border-gray-700" }, _attrs))}><div class="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 py-4"><div class="flex items-center justify-between"><div class="flex items-center gap-2"><div class="bg-gradient-to-br from-green-600 to-emerald-600 p-2 rounded-lg"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" class="text-white"><g data-fg-dmg2="1.56:1.2754:/src/app/components/Logo.tsx:17:7:352:1727:e:g"><path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22" stroke="currentColor" stroke-width="1.5" fill="none"></path><path d="M12 4C7.58 4 4 7.58 4 12C4 16.42 7.58 20 12 20" stroke="currentColor" stroke-width="0.5" fill="none" opacity="0.6"></path><path d="M12 5C8.13 5 5 8.13 5 12C5 15.87 8.13 19 12 19" stroke="currentColor" stroke-width="0.5" fill="none" opacity="0.7"></path><path d="M12 6C8.69 6 6 8.69 6 12C6 15.31 8.69 18 12 18" stroke="currentColor" stroke-width="0.5" fill="none" opacity="0.8"></path><path d="M12 7C9.24 7 7 9.24 7 12C7 14.76 9.24 17 12 17" stroke="currentColor" stroke-width="0.5" fill="none" opacity="0.9"></path><path d="M12 8C9.79 8 8 9.79 8 12C8 14.21 9.79 16 12 16" stroke="currentColor" stroke-width="0.8" fill="none"></path><path d="M12 9C10.34 9 9 10.34 9 12C9 13.66 10.34 15 12 15" stroke="currentColor" stroke-width="0.5" fill="none"></path><path d="M12 10C10.9 10 10 10.9 10 12C10 13.1 10.9 14 12 14" stroke="currentColor" stroke-width="1" fill="none"></path><circle cx="12" cy="12" r="1.5" fill="currentColor"></circle></g><g data-fg-dmg19="1.56:1.2754:/src/app/components/Logo.tsx:80:7:2123:378:e:g"><rect x="13" y="8" width="1.5" height="8" fill="currentColor" rx="0.5"></rect><rect x="15.5" y="5" width="1.5" height="14" fill="currentColor" rx="0.5"></rect><rect x="18" y="9" width="1.5" height="6" fill="currentColor" rx="0.5"></rect><rect x="20.5" y="6" width="1.5" height="12" fill="currentColor" rx="0.5"></rect></g><line x1="12" y1="2" x2="12" y2="22" stroke="currentColor" stroke-width="0.5" opacity="0.3"></line></svg></div><div class="ml-1"><h1 class="text-white text-4xl">AI Audio Genre</h1></div></div><nav class="hidden md:flex gap-8 absolute left-1/2 transform -translate-x-1/2"><a href="#home" class="text-gray-300 hover:text-green-400 transition-colors">Home</a><a href="#about" class="text-gray-300 hover:text-green-400 transition-colors">About us</a><a href="#upload" class="text-gray-300 hover:text-green-400 transition-colors">Upload</a></nav><div class="flex items-center gap-2"><button data-signin="true" class="px-4 py-2 text-gray-300 hover:text-green-400 transition-colors">Sign In</button><button data-signup="true" class="px-6 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all">Sign Up</button></div></div></div></header>`);
}
const _sfc_setup$8 = _sfc_main$8.setup;
_sfc_main$8.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/Header.vue");
  return _sfc_setup$8 ? _sfc_setup$8(props, ctx) : void 0;
};
const __nuxt_component_0 = /* @__PURE__ */ Object.assign(_export_sfc(_sfc_main$8, [["ssrRender", _sfc_ssrRender$4]]), { __name: "Header" });
const _sfc_main$7 = {};
function _sfc_ssrRender$3(_ctx, _push, _parent, _attrs) {
  _push(`<section${ssrRenderAttrs(mergeProps({ class: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20" }, _attrs))}><div class="text-center max-w-3xl mx-auto"><div class="inline-block mb-6"><div class="bg-gradient-to-br from-green-600 to-emerald-600 p-6 rounded-2xl"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" class="text-white"><g data-fg-dmg2="1.56:1.2754:/src/app/components/Logo.tsx:17:7:352:1727:e:g"><path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22" stroke="currentColor" stroke-width="1.5" fill="none"></path><path d="M12 4C7.58 4 4 7.58 4 12C4 16.42 7.58 20 12 20" stroke="currentColor" stroke-width="0.5" fill="none" opacity="0.6"></path><path d="M12 5C8.13 5 5 8.13 5 12C5 15.87 8.13 19 12 19" stroke="currentColor" stroke-width="0.5" fill="none" opacity="0.7"></path><path d="M12 6C8.69 6 6 8.69 6 12C6 15.31 8.69 18 12 18" stroke="currentColor" stroke-width="0.5" fill="none" opacity="0.8"></path><path d="M12 7C9.24 7 7 9.24 7 12C7 14.76 9.24 17 12 17" stroke="currentColor" stroke-width="0.5" fill="none" opacity="0.9"></path><path d="M12 8C9.79 8 8 9.79 8 12C8 14.21 9.79 16 12 16" stroke="currentColor" stroke-width="0.8" fill="none"></path><path d="M12 9C10.34 9 9 10.34 9 12C9 13.66 10.34 15 12 15" stroke="currentColor" stroke-width="0.5" fill="none"></path><path d="M12 10C10.9 10 10 10.9 10 12C10 13.1 10.9 14 12 14" stroke="currentColor" stroke-width="1" fill="none"></path><circle cx="12" cy="12" r="1.5" fill="currentColor"></circle></g><g data-fg-dmg19="1.56:1.2754:/src/app/components/Logo.tsx:80:7:2123:378:e:g"><rect x="13" y="8" width="1.5" height="8" fill="currentColor" rx="0.5"></rect><rect x="15.5" y="5" width="1.5" height="14" fill="currentColor" rx="0.5"></rect><rect x="18" y="9" width="1.5" height="6" fill="currentColor" rx="0.5"></rect><rect x="20.5" y="6" width="1.5" height="12" fill="currentColor" rx="0.5"></rect></g><line x1="12" y1="2" x2="12" y2="22" stroke="currentColor" stroke-width="0.5" opacity="0.3"></line></svg></div></div><h2 class="text-white text-3xl font-bold mb-6">AI-Powered Audio Genre Classification</h2><p class="text-white mb-8"> Upload your WAV audio files and let our advanced machine learning algorithms identify the music genre with precision and speed. Perfect for music libraries, streaming platforms and audio enthusiasts. </p></div></section>`);
}
const _sfc_setup$7 = _sfc_main$7.setup;
_sfc_main$7.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/Home.vue");
  return _sfc_setup$7 ? _sfc_setup$7(props, ctx) : void 0;
};
const __nuxt_component_1 = /* @__PURE__ */ Object.assign(_export_sfc(_sfc_main$7, [["ssrRender", _sfc_ssrRender$3]]), { __name: "Home" });
const _sfc_main$6 = {};
function _sfc_ssrRender$2(_ctx, _push, _parent, _attrs) {
  _push(`<section${ssrRenderAttrs(mergeProps({ class: "bg-gray-800 py-20 border-y border-gray-700" }, _attrs))}><div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"><div class="text-center mb-12"><div class="inline-flex items-center justify-center w-16 h-16 bg-green-900 rounded-full mb-4"><svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-info text-green-400"><circle cx="12" cy="12" r="10"></circle><path d="M12 16v-4"></path><path d="M12 8h.01"></path></svg></div><h2 class="text-white mb-4">About AudioGenre AI</h2><p class="text-gray-300 max-w-2xl mx-auto"> Our cutting-edge technology combines deep learning and audio signal processing to deliver accurate genre classification for your music collection. </p></div><div class="grid md:grid-cols-3 gap-8 mt-12"><div class="text-center p-6 bg-gray-900 rounded-lg border border-gray-700"><div class="bg-gradient-to-br from-green-900 to-green-800 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"><span class="text-3xl">🎯</span></div><h3 class="text-white mb-2">High Accuracy</h3><p class="text-gray-400">Our AI models are trained on millions of audio samples to ensure precise genre detection across multiple music styles.</p></div><div class="text-center p-6 bg-gray-900 rounded-lg border border-gray-700"><div class="bg-gradient-to-br from-emerald-900 to-emerald-800 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"><span class="text-3xl">⚡</span></div><h3 class="text-white mb-2">Fast Processing</h3><p class="text-gray-400">Get results in seconds with our optimized inference pipeline that analyzes audio features in real-time.</p></div><div class="text-center p-6 bg-gray-900 rounded-lg border border-gray-700"><div class="bg-gradient-to-br from-teal-900 to-teal-800 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"><span class="text-3xl">🔒</span></div><h3 class="text-white mb-2">Secure &amp; Private</h3><p class="text-gray-400">Your audio files are processed securely and never stored on our servers. Privacy is our priority.</p></div></div></div></section>`);
}
const _sfc_setup$6 = _sfc_main$6.setup;
_sfc_main$6.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/AboutUs.vue");
  return _sfc_setup$6 ? _sfc_setup$6(props, ctx) : void 0;
};
const __nuxt_component_2 = /* @__PURE__ */ Object.assign(_export_sfc(_sfc_main$6, [["ssrRender", _sfc_ssrRender$2]]), { __name: "AboutUs" });
const _sfc_main$5 = /* @__PURE__ */ defineComponent({
  __name: "Results",
  __ssrInlineRender: true,
  props: {
    data: {}
  },
  setup(__props) {
    const formatDuration = (seconds) => {
      const mins = Math.floor(seconds / 60);
      const secs = Math.floor(seconds % 60);
      return `${mins}:${secs.toString().padStart(2, "0")}`;
    };
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<!--[--><div class="bg-gradient-to-br from-green-600 to-emerald-600 rounded-lg shadow-lg p-8 text-white"><div class="flex items-center justify-between"><div><p class="text-green-100 mb-2">Primary Genre Detected</p><h2 class="text-4xl mb-2">🎵 ${ssrInterpolate(__props.data.genre)}</h2><p class="text-green-100">${ssrInterpolate(__props.data.percentages[__props.data.genre])}% confidence</p></div><div class="bg-white/20 p-6 rounded-lg backdrop-blur-sm"><svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-music2 lucide-music-2 text-white"><circle cx="8" cy="18" r="4"></circle><path d="M12 18V2l7 4"></path></svg></div></div></div><div class="bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-700 mt-6"><div class="flex items-center gap-3 mb-6"><div class="bg-green-900 p-2 rounded-lg"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-layers text-green-400"><path d="M12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83z"></path><path d="M2 12a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 12"></path><path d="M2 17a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 17"></path></svg></div><div><h3 class="text-white">Genre Distribution</h3><p class="text-gray-400">All detected genres</p></div></div><div class="space-y-4"><!--[-->`);
      ssrRenderList(__props.data.percentages, (percentage, genre) => {
        _push(`<div class="space-y-2"><div class="flex justify-between items-center"><span class="${ssrRenderClass([{ "text-yellow-400": genre === __props.data.genre }, "text-gray-200"])}">${ssrInterpolate(genre === __props.data.genre ? "🏆 " : "")}${ssrInterpolate(genre)}</span><span class="font-medium text-white">${ssrInterpolate(percentage)}%</span></div><div class="w-full bg-gray-700 rounded-full h-3 overflow-hidden"><div class="h-full rounded-full transition-all duration-1000 bg-gradient-to-r from-green-500 to-emerald-500" style="${ssrRenderStyle({ width: `${percentage}%` })}"></div></div></div>`);
      });
      _push(`<!--]--></div></div><div class="bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-700 mt-6"><div class="flex items-center gap-3 mb-6"><div class="bg-green-900 p-2 rounded-lg"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-file-audio text-green-400"><path d="M17.5 22h.5a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v3"></path><path d="M14 2v4a2 2 0 0 0 2 2h4"></path><path d="M2 19a2 2 0 1 1 4 0v1a2 2 0 1 1-4 0v-4a6 6 0 0 1 12 0v4a2 2 0 1 1-4 0v-1a2 2 0 1 1 4 0"></path></svg></div><div><h3 class="text-white">Audio Information</h3><p class="text-gray-400 truncate">${ssrInterpolate(__props.data.filename)}</p></div></div><div class="space-y-4"><div class="flex items-center justify-between p-3 bg-gray-900 rounded-lg"><div class="flex items-center gap-3"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-clock text-green-400"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg><span class="text-gray-300">Duration</span></div><span class="text-white font-medium">${ssrInterpolate(formatDuration(__props.data.audio_metadata.duration))}</span></div><div class="flex items-center justify-between p-3 bg-gray-900 rounded-lg"><div class="flex items-center gap-3"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-radio text-green-400"><path d="M4.9 19.1C1 15.2 1 8.8 4.9 4.9"></path><path d="M7.8 16.2c-2.3-2.3-2.3-6.1 0-8.5"></path><circle cx="12" cy="12" r="2"></circle><path d="M16.2 7.8c2.3 2.3 2.3 6.1 0 8.5"></path><path d="M19.1 4.9C23 8.8 23 15.1 19.1 19"></path></svg><span class="text-gray-300">Sample Rate</span></div><span class="text-white font-medium">${ssrInterpolate(__props.data.audio_metadata.sample_rate.toLocaleString())} Hz</span></div><div class="flex items-center justify-between p-3 bg-gray-900 rounded-lg"><div class="flex items-center gap-3"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-layers text-green-400"><path d="M12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83z"></path><path d="M2 12a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 12"></path><path d="M2 17a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 17"></path></svg><span class="text-gray-300">Total Segments</span></div><span class="text-white font-medium">${ssrInterpolate(__props.data.audio_metadata.total_segments)}</span></div><div class="flex items-center justify-between p-3 bg-gray-900 rounded-lg"><div class="flex items-center gap-3"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-activity text-green-400"><path d="M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2"></path></svg><span class="text-gray-300">Segment Duration</span></div><span class="text-white font-medium">${ssrInterpolate(__props.data.audio_metadata.segment_duration)}.00s</span></div></div></div><div class="bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-700 mt-6"><div class="flex items-center gap-3 mb-6"><div class="bg-green-900 p-2 rounded-lg"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-activity text-green-400"><path d="M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2"></path></svg></div><div><h3 class="text-white">RMS Loudness Over Time</h3><p class="text-gray-400">Audio intensity analysis</p></div></div><div class="h-64"><div class="recharts-responsive-container" style="${ssrRenderStyle({ "width": "100%", "height": "100%", "min-width": "0px" })}"><div class="recharts-wrapper" style="${ssrRenderStyle({ "position": "relative", "cursor": "default", "width": "100%", "height": "100%", "max-height": "256px", "max-width": "757px" })}"><svg class="recharts-surface" width="757" height="256" viewBox="0 0 757 256" style="${ssrRenderStyle({ "width": "100%", "height": "100%" })}"><title></title><desc></desc><defs><clipPath id="recharts1-clip"><rect x="65" y="5" height="216" width="687"></rect></clipPath></defs><defs><linearGradient id="loudnessGradient" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stop-color="#10b981" stop-opacity="0.8"></stop><stop offset="95%" stop-color="#10b981" stop-opacity="0.1"></stop></linearGradient></defs><g class="recharts-cartesian-grid"><g class="recharts-cartesian-grid-horizontal"><line stroke-dasharray="3 3" stroke="#374151" fill="none" x="65" y="5" width="687" height="216" x1="65" y1="221" x2="752" y2="221"></line><line stroke-dasharray="3 3" stroke="#374151" fill="none" x="65" y="5" width="687" height="216" x1="65" y1="167" x2="752" y2="167"></line><line stroke-dasharray="3 3" stroke="#374151" fill="none" x="65" y="5" width="687" height="216" x1="65" y1="113" x2="752" y2="113"></line><line stroke-dasharray="3 3" stroke="#374151" fill="none" x="65" y="5" width="687" height="216" x1="65" y1="59" x2="752" y2="59"></line><line stroke-dasharray="3 3" stroke="#374151" fill="none" x="65" y="5" width="687" height="216" x1="65" y1="5" x2="752" y2="5"></line></g><g class="recharts-cartesian-grid-vertical"><line stroke-dasharray="3 3" stroke="#374151" fill="none" x="65" y="5" width="687" height="216" x1="79.0204081632653" y1="5" x2="79.0204081632653" y2="221"></line><line stroke-dasharray="3 3" stroke="#374151" fill="none" x="65" y="5" width="687" height="216" x1="107.06122448979592" y1="5" x2="107.06122448979592" y2="221"></line><line stroke-dasharray="3 3" stroke="#374151" fill="none" x="65" y="5" width="687" height="216" x1="149.12244897959184" y1="5" x2="149.12244897959184" y2="221"></line><line stroke-dasharray="3 3" stroke="#374151" fill="none" x="65" y="5" width="687" height="216" x1="191.18367346938777" y1="5" x2="191.18367346938777" y2="221"></line><line stroke-dasharray="3 3" stroke="#374151" fill="none" x="65" y="5" width="687" height="216" x1="233.24489795918367" y1="5" x2="233.24489795918367" y2="221"></line><line stroke-dasharray="3 3" stroke="#374151" fill="none" x="65" y="5" width="687" height="216" x1="275.30612244897964" y1="5" x2="275.30612244897964" y2="221"></line><line stroke-dasharray="3 3" stroke="#374151" fill="none" x="65" y="5" width="687" height="216" x1="317.36734693877554" y1="5" x2="317.36734693877554" y2="221"></line><line stroke-dasharray="3 3" stroke="#374151" fill="none" x="65" y="5" width="687" height="216" x1="359.42857142857144" y1="5" x2="359.42857142857144" y2="221"></line><line stroke-dasharray="3 3" stroke="#374151" fill="none" x="65" y="5" width="687" height="216" x1="401.48979591836735" y1="5" x2="401.48979591836735" y2="221"></line><line stroke-dasharray="3 3" stroke="#374151" fill="none" x="65" y="5" width="687" height="216" x1="443.5510204081633" y1="5" x2="443.5510204081633" y2="221"></line><line stroke-dasharray="3 3" stroke="#374151" fill="none" x="65" y="5" width="687" height="216" x1="485.6122448979592" y1="5" x2="485.6122448979592" y2="221"></line><line stroke-dasharray="3 3" stroke="#374151" fill="none" x="65" y="5" width="687" height="216" x1="527.6734693877552" y1="5" x2="527.6734693877552" y2="221"></line><line stroke-dasharray="3 3" stroke="#374151" fill="none" x="65" y="5" width="687" height="216" x1="569.7346938775511" y1="5" x2="569.7346938775511" y2="221"></line><line stroke-dasharray="3 3" stroke="#374151" fill="none" x="65" y="5" width="687" height="216" x1="625.8163265306123" y1="5" x2="625.8163265306123" y2="221"></line><line stroke-dasharray="3 3" stroke="#374151" fill="none" x="65" y="5" width="687" height="216" x1="681.8979591836735" y1="5" x2="681.8979591836735" y2="221"></line><line stroke-dasharray="3 3" stroke="#374151" fill="none" x="65" y="5" width="687" height="216" x1="752" y1="5" x2="752" y2="221"></line><line stroke-dasharray="3 3" stroke="#374151" fill="none" x="65" y="5" width="687" height="216" x1="65" y1="5" x2="65" y2="221"></line></g></g><g class="recharts-layer recharts-cartesian-axis recharts-xAxis xAxis"><line orientation="bottom" width="687" height="30" stroke="#9ca3af" x="65" y="221" class="recharts-cartesian-axis-line" fill="none" x1="65" y1="221" x2="752" y2="221"></line><g class="recharts-cartesian-axis-ticks"><g class="recharts-layer recharts-cartesian-axis-tick"><line orientation="bottom" width="687" height="30" stroke="#9ca3af" x="65" y="221" class="recharts-cartesian-axis-tick-line" fill="none" x1="79.0204081632653" y1="227" x2="79.0204081632653" y2="221"></line><text orientation="bottom" width="687" height="30" stroke="none" x="79.0204081632653" y="229" class="recharts-text recharts-cartesian-axis-tick-value" text-anchor="middle" fill="#9ca3af"><tspan x="79.0204081632653" dy="0.71em">3.0</tspan></text></g><g class="recharts-layer recharts-cartesian-axis-tick"><line orientation="bottom" width="687" height="30" stroke="#9ca3af" x="65" y="221" class="recharts-cartesian-axis-tick-line" fill="none" x1="107.06122448979592" y1="227" x2="107.06122448979592" y2="221"></line><text orientation="bottom" width="687" height="30" stroke="none" x="107.06122448979592" y="229" class="recharts-text recharts-cartesian-axis-tick-value" text-anchor="middle" fill="#9ca3af"><tspan x="107.06122448979592" dy="0.71em">9.0</tspan></text></g><g class="recharts-layer recharts-cartesian-axis-tick"><line orientation="bottom" width="687" height="30" stroke="#9ca3af" x="65" y="221" class="recharts-cartesian-axis-tick-line" fill="none" x1="149.12244897959184" y1="227" x2="149.12244897959184" y2="221"></line><text orientation="bottom" width="687" height="30" stroke="none" x="149.12244897959184" y="229" class="recharts-text recharts-cartesian-axis-tick-value" text-anchor="middle" fill="#9ca3af"><tspan x="149.12244897959184" dy="0.71em">18.0</tspan></text></g><g class="recharts-layer recharts-cartesian-axis-tick"><line orientation="bottom" width="687" height="30" stroke="#9ca3af" x="65" y="221" class="recharts-cartesian-axis-tick-line" fill="none" x1="191.18367346938777" y1="227" x2="191.18367346938777" y2="221"></line><text orientation="bottom" width="687" height="30" stroke="none" x="191.18367346938777" y="229" class="recharts-text recharts-cartesian-axis-tick-value" text-anchor="middle" fill="#9ca3af"><tspan x="191.18367346938777" dy="0.71em">27.0</tspan></text></g><g class="recharts-layer recharts-cartesian-axis-tick"><line orientation="bottom" width="687" height="30" stroke="#9ca3af" x="65" y="221" class="recharts-cartesian-axis-tick-line" fill="none" x1="233.24489795918367" y1="227" x2="233.24489795918367" y2="221"></line><text orientation="bottom" width="687" height="30" stroke="none" x="233.24489795918367" y="229" class="recharts-text recharts-cartesian-axis-tick-value" text-anchor="middle" fill="#9ca3af"><tspan x="233.24489795918367" dy="0.71em">36.0</tspan></text></g><g class="recharts-layer recharts-cartesian-axis-tick"><line orientation="bottom" width="687" height="30" stroke="#9ca3af" x="65" y="221" class="recharts-cartesian-axis-tick-line" fill="none" x1="275.30612244897964" y1="227" x2="275.30612244897964" y2="221"></line><text orientation="bottom" width="687" height="30" stroke="none" x="275.30612244897964" y="229" class="recharts-text recharts-cartesian-axis-tick-value" text-anchor="middle" fill="#9ca3af"><tspan x="275.30612244897964" dy="0.71em">45.0</tspan></text></g><g class="recharts-layer recharts-cartesian-axis-tick"><line orientation="bottom" width="687" height="30" stroke="#9ca3af" x="65" y="221" class="recharts-cartesian-axis-tick-line" fill="none" x1="317.36734693877554" y1="227" x2="317.36734693877554" y2="221"></line><text orientation="bottom" width="687" height="30" stroke="none" x="317.36734693877554" y="229" class="recharts-text recharts-cartesian-axis-tick-value" text-anchor="middle" fill="#9ca3af"><tspan x="317.36734693877554" dy="0.71em">54.0</tspan></text></g><g class="recharts-layer recharts-cartesian-axis-tick"><line orientation="bottom" width="687" height="30" stroke="#9ca3af" x="65" y="221" class="recharts-cartesian-axis-tick-line" fill="none" x1="359.42857142857144" y1="227" x2="359.42857142857144" y2="221"></line><text orientation="bottom" width="687" height="30" stroke="none" x="359.42857142857144" y="229" class="recharts-text recharts-cartesian-axis-tick-value" text-anchor="middle" fill="#9ca3af"><tspan x="359.42857142857144" dy="0.71em">63.0</tspan></text></g><g class="recharts-layer recharts-cartesian-axis-tick"><line orientation="bottom" width="687" height="30" stroke="#9ca3af" x="65" y="221" class="recharts-cartesian-axis-tick-line" fill="none" x1="401.48979591836735" y1="227" x2="401.48979591836735" y2="221"></line><text orientation="bottom" width="687" height="30" stroke="none" x="401.48979591836735" y="229" class="recharts-text recharts-cartesian-axis-tick-value" text-anchor="middle" fill="#9ca3af"><tspan x="401.48979591836735" dy="0.71em">72.0</tspan></text></g><g class="recharts-layer recharts-cartesian-axis-tick"><line orientation="bottom" width="687" height="30" stroke="#9ca3af" x="65" y="221" class="recharts-cartesian-axis-tick-line" fill="none" x1="443.5510204081633" y1="227" x2="443.5510204081633" y2="221"></line><text orientation="bottom" width="687" height="30" stroke="none" x="443.5510204081633" y="229" class="recharts-text recharts-cartesian-axis-tick-value" text-anchor="middle" fill="#9ca3af"><tspan x="443.5510204081633" dy="0.71em">81.0</tspan></text></g><g class="recharts-layer recharts-cartesian-axis-tick"><line orientation="bottom" width="687" height="30" stroke="#9ca3af" x="65" y="221" class="recharts-cartesian-axis-tick-line" fill="none" x1="485.6122448979592" y1="227" x2="485.6122448979592" y2="221"></line><text orientation="bottom" width="687" height="30" stroke="none" x="485.6122448979592" y="229" class="recharts-text recharts-cartesian-axis-tick-value" text-anchor="middle" fill="#9ca3af"><tspan x="485.6122448979592" dy="0.71em">90.0</tspan></text></g><g class="recharts-layer recharts-cartesian-axis-tick"><line orientation="bottom" width="687" height="30" stroke="#9ca3af" x="65" y="221" class="recharts-cartesian-axis-tick-line" fill="none" x1="527.6734693877552" y1="227" x2="527.6734693877552" y2="221"></line><text orientation="bottom" width="687" height="30" stroke="none" x="527.6734693877552" y="229" class="recharts-text recharts-cartesian-axis-tick-value" text-anchor="middle" fill="#9ca3af"><tspan x="527.6734693877552" dy="0.71em">99.0</tspan></text></g><g class="recharts-layer recharts-cartesian-axis-tick"><line orientation="bottom" width="687" height="30" stroke="#9ca3af" x="65" y="221" class="recharts-cartesian-axis-tick-line" fill="none" x1="569.7346938775511" y1="227" x2="569.7346938775511" y2="221"></line><text orientation="bottom" width="687" height="30" stroke="none" x="569.7346938775511" y="229" class="recharts-text recharts-cartesian-axis-tick-value" text-anchor="middle" fill="#9ca3af"><tspan x="569.7346938775511" dy="0.71em">108.0</tspan></text></g><g class="recharts-layer recharts-cartesian-axis-tick"><line orientation="bottom" width="687" height="30" stroke="#9ca3af" x="65" y="221" class="recharts-cartesian-axis-tick-line" fill="none" x1="625.8163265306123" y1="227" x2="625.8163265306123" y2="221"></line><text orientation="bottom" width="687" height="30" stroke="none" x="625.8163265306123" y="229" class="recharts-text recharts-cartesian-axis-tick-value" text-anchor="middle" fill="#9ca3af"><tspan x="625.8163265306123" dy="0.71em">120.0</tspan></text></g><g class="recharts-layer recharts-cartesian-axis-tick"><line orientation="bottom" width="687" height="30" stroke="#9ca3af" x="65" y="221" class="recharts-cartesian-axis-tick-line" fill="none" x1="681.8979591836735" y1="227" x2="681.8979591836735" y2="221"></line><text orientation="bottom" width="687" height="30" stroke="none" x="681.8979591836735" y="229" class="recharts-text recharts-cartesian-axis-tick-value" text-anchor="middle" fill="#9ca3af"><tspan x="681.8979591836735" dy="0.71em">132.0</tspan></text></g><g class="recharts-layer recharts-cartesian-axis-tick"><line orientation="bottom" width="687" height="30" stroke="#9ca3af" x="65" y="221" class="recharts-cartesian-axis-tick-line" fill="none" x1="752" y1="227" x2="752" y2="221"></line><text orientation="bottom" width="687" height="30" stroke="none" x="736.9765625" y="229" class="recharts-text recharts-cartesian-axis-tick-value" text-anchor="middle" fill="#9ca3af"><tspan x="736.9765625" dy="0.71em">147.0</tspan></text></g></g><text offset="-5" x="408.5" y="256" class="recharts-text recharts-label" text-anchor="middle" fill="#9ca3af"><tspan x="408.5" dy="0em">Time (seconds)</tspan></text></g><g class="recharts-layer recharts-cartesian-axis recharts-yAxis yAxis"><line orientation="left" width="60" height="216" stroke="#9ca3af" x="5" y="5" class="recharts-cartesian-axis-line" fill="none" x1="65" y1="5" x2="65" y2="221"></line><g class="recharts-cartesian-axis-ticks"><g class="recharts-layer recharts-cartesian-axis-tick"><line orientation="left" width="60" height="216" stroke="#9ca3af" x="5" y="5" class="recharts-cartesian-axis-tick-line" fill="none" x1="59" y1="221" x2="65" y2="221"></line><text orientation="left" width="60" height="216" stroke="none" x="57" y="221" class="recharts-text recharts-cartesian-axis-tick-value" text-anchor="end" fill="#9ca3af"><tspan x="57" dy="0.355em">0</tspan></text></g><g class="recharts-layer recharts-cartesian-axis-tick"><line orientation="left" width="60" height="216" stroke="#9ca3af" x="5" y="5" class="recharts-cartesian-axis-tick-line" fill="none" x1="59" y1="167" x2="65" y2="167"></line><text orientation="left" width="60" height="216" stroke="none" x="57" y="167" class="recharts-text recharts-cartesian-axis-tick-value" text-anchor="end" fill="#9ca3af"><tspan x="57" dy="0.355em">0.15</tspan></text></g><g class="recharts-layer recharts-cartesian-axis-tick"><line orientation="left" width="60" height="216" stroke="#9ca3af" x="5" y="5" class="recharts-cartesian-axis-tick-line" fill="none" x1="59" y1="113" x2="65" y2="113"></line><text orientation="left" width="60" height="216" stroke="none" x="57" y="113" class="recharts-text recharts-cartesian-axis-tick-value" text-anchor="end" fill="#9ca3af"><tspan x="57" dy="0.355em">0.3</tspan></text></g><g class="recharts-layer recharts-cartesian-axis-tick"><line orientation="left" width="60" height="216" stroke="#9ca3af" x="5" y="5" class="recharts-cartesian-axis-tick-line" fill="none" x1="59" y1="59" x2="65" y2="59"></line><text orientation="left" width="60" height="216" stroke="none" x="57" y="59" class="recharts-text recharts-cartesian-axis-tick-value" text-anchor="end" fill="#9ca3af"><tspan x="57" dy="0.355em">0.45</tspan></text></g><g class="recharts-layer recharts-cartesian-axis-tick"><line orientation="left" width="60" height="216" stroke="#9ca3af" x="5" y="5" class="recharts-cartesian-axis-tick-line" fill="none" x1="59" y1="5" x2="65" y2="5"></line><text orientation="left" width="60" height="216" stroke="none" x="57" y="12" class="recharts-text recharts-cartesian-axis-tick-value" text-anchor="end" fill="#9ca3af"><tspan x="57" dy="0.355em">0.6</tspan></text></g></g><text offset="5" transform="rotate(-90, 10, 113)" x="10" y="113" class="recharts-text recharts-label" text-anchor="start" fill="#9ca3af"><tspan x="10" dy="0.355em">RMS Loudness</tspan></text></g><g class="recharts-layer recharts-area"><g class="recharts-layer"><defs><clipPath id="animationClipPath-recharts-area-3"><rect x="65" y="0" width="687" height="223"></rect></clipPath></defs><g class="recharts-layer" clip-path="url(#animationClipPath-recharts-area-3)"><g class="recharts-layer"><path stroke-width="2" fill="url(#loudnessGradient)" fill-opacity="0.6" width="687" height="216" stroke="none" class="recharts-curve recharts-area-area" d="M65,130.69C69.673,105.112,74.347,79.534,79.02,79.534C83.694,79.534,88.367,102.006,93.041,102.006C97.714,102.006,102.388,87.958,107.061,87.958C111.735,87.958,116.408,98.923,121.082,114.933C125.755,130.943,130.429,184.018,135.102,184.018C139.776,184.018,144.449,165.453,149.122,154.509C153.796,143.566,158.469,135.579,163.143,118.358C167.816,101.136,172.49,51.18,177.163,51.18C181.837,51.18,186.51,62.816,191.184,81.495C195.857,100.175,200.531,163.257,205.204,163.257C209.878,163.257,214.551,158.534,219.224,149.088C223.898,139.643,228.571,54.487,233.245,54.487C237.918,54.487,242.592,167.36,247.265,167.36C251.939,167.36,256.612,110.028,261.286,110.028C265.959,110.028,270.633,156.796,275.306,156.796C279.98,156.796,284.653,122.313,289.327,102.217C294,82.121,298.673,52.239,303.347,36.219C308.02,20.199,312.694,6.096,317.367,6.096C322.041,6.096,326.714,24.513,331.388,50.132C336.061,75.751,340.735,159.812,345.408,159.812C350.082,159.812,354.755,101.382,359.429,77.911C364.102,54.44,368.776,18.988,373.449,18.988C378.122,18.988,382.796,57.19,387.469,69.686C392.143,82.182,396.816,93.965,401.49,93.965C406.163,93.965,410.837,83.735,415.51,71.612C420.184,59.489,424.857,27.398,429.531,21.227C434.204,15.057,438.878,11.972,443.551,11.972C448.224,11.972,452.898,59.77,457.571,87.287C462.245,114.805,466.918,172.169,471.592,177.078C476.265,181.988,480.939,184.443,485.612,184.443C490.286,184.443,494.959,18.324,499.633,18.324C504.306,18.324,508.98,133.171,513.653,150.776C518.327,168.381,523,177.183,527.673,177.183C532.347,177.183,537.02,34.165,541.694,34.165C546.367,34.165,551.041,50.059,555.714,67.598C560.388,85.137,565.061,134.609,569.735,139.398C574.408,144.188,579.082,146.583,583.755,146.583C588.429,146.583,593.102,51.271,597.776,51.271C602.449,51.271,607.122,123.705,611.796,123.705C616.469,123.705,621.143,105.276,625.816,105.276C630.49,105.276,635.163,127.35,639.837,135.53C644.51,143.71,649.184,149.861,653.857,154.354C658.531,158.848,663.204,162.489,667.878,162.489C672.551,162.489,677.224,56.799,681.898,56.799C686.571,56.799,691.245,180.278,695.918,180.278C700.592,180.278,705.265,9.727,709.939,9.727C714.612,9.727,719.286,126.413,723.959,126.413C728.633,126.413,733.306,26.459,737.98,26.459C742.653,26.459,747.327,71.933,752,117.406L752,221C747.327,221,742.653,221,737.98,221C733.306,221,728.633,221,723.959,221C719.286,221,714.612,221,709.939,221C705.265,221,700.592,221,695.918,221C691.245,221,686.571,221,681.898,221C677.224,221,672.551,221,667.878,221C663.204,221,658.531,221,653.857,221C649.184,221,644.51,221,639.837,221C635.163,221,630.49,221,625.816,221C621.143,221,616.469,221,611.796,221C607.122,221,602.449,221,597.776,221C593.102,221,588.429,221,583.755,221C579.082,221,574.408,221,569.735,221C565.061,221,560.388,221,555.714,221C551.041,221,546.367,221,541.694,221C537.02,221,532.347,221,527.673,221C523,221,518.327,221,513.653,221C508.98,221,504.306,221,499.633,221C494.959,221,490.286,221,485.612,221C480.939,221,476.265,221,471.592,221C466.918,221,462.245,221,457.571,221C452.898,221,448.224,221,443.551,221C438.878,221,434.204,221,429.531,221C424.857,221,420.184,221,415.51,221C410.837,221,406.163,221,401.49,221C396.816,221,392.143,221,387.469,221C382.796,221,378.122,221,373.449,221C368.776,221,364.102,221,359.429,221C354.755,221,350.082,221,345.408,221C340.735,221,336.061,221,331.388,221C326.714,221,322.041,221,317.367,221C312.694,221,308.02,221,303.347,221C298.673,221,294,221,289.327,221C284.653,221,279.98,221,275.306,221C270.633,221,265.959,221,261.286,221C256.612,221,251.939,221,247.265,221C242.592,221,237.918,221,233.245,221C228.571,221,223.898,221,219.224,221C214.551,221,209.878,221,205.204,221C200.531,221,195.857,221,191.184,221C186.51,221,181.837,221,177.163,221C172.49,221,167.816,221,163.143,221C158.469,221,153.796,221,149.122,221C144.449,221,139.776,221,135.102,221C130.429,221,125.755,221,121.082,221C116.408,221,111.735,221,107.061,221C102.388,221,97.714,221,93.041,221C88.367,221,83.694,221,79.02,221C74.347,221,69.673,221,65,221Z"></path><path stroke="#10b981" stroke-width="2" fill="none" class="recharts-curve recharts-area-curve" d="M65,130.69C69.673,105.112,74.347,79.534,79.02,79.534C83.694,79.534,88.367,102.006,93.041,102.006C97.714,102.006,102.388,87.958,107.061,87.958C111.735,87.958,116.408,98.923,121.082,114.933C125.755,130.943,130.429,184.018,135.102,184.018C139.776,184.018,144.449,165.453,149.122,154.509C153.796,143.566,158.469,135.579,163.143,118.358C167.816,101.136,172.49,51.18,177.163,51.18C181.837,51.18,186.51,62.816,191.184,81.495C195.857,100.175,200.531,163.257,205.204,163.257C209.878,163.257,214.551,158.534,219.224,149.088C223.898,139.643,228.571,54.487,233.245,54.487C237.918,54.487,242.592,167.36,247.265,167.36C251.939,167.36,256.612,110.028,261.286,110.028C265.959,110.028,270.633,156.796,275.306,156.796C279.98,156.796,284.653,122.313,289.327,102.217C294,82.121,298.673,52.239,303.347,36.219C308.02,20.199,312.694,6.096,317.367,6.096C322.041,6.096,326.714,24.513,331.388,50.132C336.061,75.751,340.735,159.812,345.408,159.812C350.082,159.812,354.755,101.382,359.429,77.911C364.102,54.44,368.776,18.988,373.449,18.988C378.122,18.988,382.796,57.19,387.469,69.686C392.143,82.182,396.816,93.965,401.49,93.965C406.163,93.965,410.837,83.735,415.51,71.612C420.184,59.489,424.857,27.398,429.531,21.227C434.204,15.057,438.878,11.972,443.551,11.972C448.224,11.972,452.898,59.77,457.571,87.287C462.245,114.805,466.918,172.169,471.592,177.078C476.265,181.988,480.939,184.443,485.612,184.443C490.286,184.443,494.959,18.324,499.633,18.324C504.306,18.324,508.98,133.171,513.653,150.776C518.327,168.381,523,177.183,527.673,177.183C532.347,177.183,537.02,34.165,541.694,34.165C546.367,34.165,551.041,50.059,555.714,67.598C560.388,85.137,565.061,134.609,569.735,139.398C574.408,144.188,579.082,146.583,583.755,146.583C588.429,146.583,593.102,51.271,597.776,51.271C602.449,51.271,607.122,123.705,611.796,123.705C616.469,123.705,621.143,105.276,625.816,105.276C630.49,105.276,635.163,127.35,639.837,135.53C644.51,143.71,649.184,149.861,653.857,154.354C658.531,158.848,663.204,162.489,667.878,162.489C672.551,162.489,677.224,56.799,681.898,56.799C686.571,56.799,691.245,180.278,695.918,180.278C700.592,180.278,705.265,9.727,709.939,9.727C714.612,9.727,719.286,126.413,723.959,126.413C728.633,126.413,733.306,26.459,737.98,26.459C742.653,26.459,747.327,71.933,752,117.406"></path></g></g></g></g></svg></div></div></div></div><div class="bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-700 mt-6"><div class="flex items-center gap-3 mb-6"><div class="bg-green-900 p-2 rounded-lg"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-bar-chart text-green-400"><path d="M12 2v20M2 12h20M7 7h10M7 17h10"></path></svg></div><div><h3 class="text-white">Spectrogram</h3><p class="text-gray-400">Frequency analysis over time</p></div></div><img${ssrRenderAttr("src", "data:image/png;base64," + __props.data.spectrogram)} alt="Spectrogram" class="w-full rounded-lg"></div><!--]-->`);
    };
  }
});
const _sfc_setup$5 = _sfc_main$5.setup;
_sfc_main$5.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/Results.vue");
  return _sfc_setup$5 ? _sfc_setup$5(props, ctx) : void 0;
};
const Results = Object.assign(_sfc_main$5, { __name: "Results" });
const _sfc_main$4 = /* @__PURE__ */ defineComponent({
  __name: "Upload",
  __ssrInlineRender: true,
  setup(__props) {
    const uploadedFile = ref(null);
    const showResults = ref(false);
    const resultsData = ref(null);
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<section${ssrRenderAttrs(mergeProps({
        id: "upload",
        class: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20"
      }, _attrs))}><div class="text-center mb-12"><h2 class="text-white mb-4">Upload Your Audio</h2><p class="text-gray-300 max-w-2xl mx-auto"> Drop your WAV file below and our AI will analyze it to determine the most likely music genre with confidence scores. </p></div><div class="w-full max-w-2xl mx-auto">`);
      if (!uploadedFile.value) {
        _push(`<div class="border-2 border-dashed rounded-lg p-12 text-center transition-colors border-gray-600 hover:border-gray-500 bg-gray-800"><svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-upload mx-auto mb-4 text-gray-500"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" x2="12" y1="3" y2="15"></line></svg><h3 class="mb-2 text-gray-200">Drop your WAV file here</h3><p class="mb-4 text-gray-400">or</p><label class="inline-block px-6 py-3 bg-green-600 text-white rounded-lg cursor-pointer hover:bg-green-700 transition-colors"> Browse Files <input type="file" accept=".wav,audio/wav" class="hidden"></label><p class="mt-4 text-gray-500">Supported format: WAV</p></div>`);
      } else {
        _push(`<div class="border-2 border-dashed rounded-lg p-12 text-center transition-colors border-gray-600 hover:border-gray-500 bg-gray-800"><div class="space-y-4"><div class="flex items-center justify-center gap-3 bg-gray-700 p-4 rounded-lg"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-music text-green-400"><path d="M9 18V5l12-2v13"></path><circle cx="6" cy="18" r="3"></circle><circle cx="18" cy="16" r="3"></circle></svg><span class="flex-1 text-left text-gray-200">${ssrInterpolate(uploadedFile.value.name)}</span><button class="text-gray-400 hover:text-gray-200 transition-colors"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-x"><path d="M18 6 6 18"></path><path d="m6 6 12 12"></path></svg></button></div><button class="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed">Classify Genre</button></div></div>`);
      }
      if (showResults.value) {
        _push(ssrRenderComponent(Results, { data: resultsData.value }, null, _parent));
      } else {
        _push(`<!---->`);
      }
      _push(`</div></section>`);
    };
  }
});
const _sfc_setup$4 = _sfc_main$4.setup;
_sfc_main$4.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/Upload.vue");
  return _sfc_setup$4 ? _sfc_setup$4(props, ctx) : void 0;
};
const __nuxt_component_3 = Object.assign(_sfc_main$4, { __name: "Upload" });
const _sfc_main$3 = {};
function _sfc_ssrRender$1(_ctx, _push, _parent, _attrs) {
  _push(`<footer${ssrRenderAttrs(mergeProps({ class: "bg-gray-950 text-white py-12 border-t border-gray-800" }, _attrs))}><div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"><div class="text-center"><div class="flex items-center justify-center gap-3 mb-4"><div class="bg-gradient-to-br from-green-600 to-emerald-600 p-2 rounded-lg"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="text-white"><g><path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22" stroke="currentColor" stroke-width="1.5" fill="none"></path><path d="M12 4C7.58 4 4 7.58 4 12C4 16.42 7.58 20 12 20" stroke="currentColor" stroke-width="0.5" fill="none" opacity="0.6"></path><path d="M12 5C8.13 5 5 8.13 5 12C5 15.87 8.13 19 12 19" stroke="currentColor" stroke-width="0.5" fill="none" opacity="0.7"></path><path d="M12 6C8.69 6 6 8.69 6 12C6 15.31 8.69 18 12 18" stroke="currentColor" stroke-width="0.5" fill="none" opacity="0.8"></path><path d="M12 7C9.24 7 7 9.24 7 12C7 14.76 9.24 17 12 17" stroke="currentColor" stroke-width="0.5" fill="none" opacity="0.9"></path><path d="M12 8C9.79 8 8 9.79 8 12C8 14.21 9.79 16 12 16" stroke="currentColor" stroke-width="0.8" fill="none"></path><path d="M12 9C10.34 9 9 10.34 9 12C9 13.66 10.34 15 12 15" stroke="currentColor" stroke-width="0.5" fill="none"></path><path d="M12 10C10.9 10 10 10.9 10 12C10 13.1 10.9 14 12 14" stroke="currentColor" stroke-width="1" fill="none"></path><circle cx="12" cy="12" r="1.5" fill="currentColor"></circle></g><g><rect x="13" y="8" width="1.5" height="8" fill="currentColor" rx="0.5"></rect><rect x="15.5" y="5" width="1.5" height="14" fill="currentColor" rx="0.5"></rect><rect x="18" y="9" width="1.5" height="6" fill="currentColor" rx="0.5"></rect><rect x="20.5" y="6" width="1.5" height="12" fill="currentColor" rx="0.5"></rect></g><line x1="12" y1="2" x2="12" y2="22" stroke="currentColor" stroke-width="0.5" opacity="0.3"></line></svg></div><span class="text-xl">AudioGenre AI</span></div><p class="text-gray-400 mb-4">Powered by advanced machine learning for accurate music classification</p><p class="text-gray-500">© 2025 AudioGenre AI. All rights reserved.</p></div></div></footer>`);
}
const _sfc_setup$3 = _sfc_main$3.setup;
_sfc_main$3.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/Footer.vue");
  return _sfc_setup$3 ? _sfc_setup$3(props, ctx) : void 0;
};
const __nuxt_component_4 = /* @__PURE__ */ Object.assign(_export_sfc(_sfc_main$3, [["ssrRender", _sfc_ssrRender$1]]), { __name: "Footer" });
const _sfc_main$2 = {};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs) {
  const _component_Header = __nuxt_component_0;
  const _component_Home = __nuxt_component_1;
  const _component_AboutUs = __nuxt_component_2;
  const _component_Upload = __nuxt_component_3;
  const _component_Footer = __nuxt_component_4;
  _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900" }, _attrs))}>`);
  _push(ssrRenderComponent(_component_Header, null, null, _parent));
  _push(ssrRenderComponent(_component_Home, null, null, _parent));
  _push(ssrRenderComponent(_component_AboutUs, null, null, _parent));
  _push(ssrRenderComponent(_component_Upload, null, null, _parent));
  _push(ssrRenderComponent(_component_Footer, null, null, _parent));
  _push(`</div>`);
}
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("app.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const AppComponent = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["ssrRender", _sfc_ssrRender]]);
const _sfc_main$1 = {
  __name: "nuxt-error-page",
  __ssrInlineRender: true,
  props: {
    error: Object
  },
  setup(__props) {
    const props = __props;
    const _error = props.error;
    _error.stack ? _error.stack.split("\n").splice(1).map((line) => {
      const text = line.replace("webpack:/", "").replace(".vue", ".js").trim();
      return {
        text,
        internal: line.includes("node_modules") && !line.includes(".cache") || line.includes("internal") || line.includes("new Promise")
      };
    }).map((i) => `<span class="stack${i.internal ? " internal" : ""}">${i.text}</span>`).join("\n") : "";
    const statusCode = Number(_error.statusCode || 500);
    const is404 = statusCode === 404;
    const statusMessage = _error.statusMessage ?? (is404 ? "Page Not Found" : "Internal Server Error");
    const description = _error.message || _error.toString();
    const stack = void 0;
    const _Error404 = defineAsyncComponent(() => import('./error-404-DYoUEFxz.mjs'));
    const _Error = defineAsyncComponent(() => import('./error-500-BoGBaO-Y.mjs'));
    const ErrorTemplate = is404 ? _Error404 : _Error;
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(unref(ErrorTemplate), mergeProps({ statusCode: unref(statusCode), statusMessage: unref(statusMessage), description: unref(description), stack: unref(stack) }, _attrs), null, _parent));
    };
  }
};
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../node_modules/nuxt/dist/app/components/nuxt-error-page.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const _sfc_main = {
  __name: "nuxt-root",
  __ssrInlineRender: true,
  setup(__props) {
    const IslandRenderer = () => null;
    const nuxtApp = useNuxtApp();
    nuxtApp.deferHydration();
    nuxtApp.ssrContext.url;
    const SingleRenderer = false;
    provide(PageRouteSymbol, useRoute());
    nuxtApp.hooks.callHookWith((hooks) => hooks.map((hook) => hook()), "vue:setup");
    const error = /* @__PURE__ */ useError();
    const abortRender = error.value && !nuxtApp.ssrContext.error;
    onErrorCaptured((err, target, info) => {
      nuxtApp.hooks.callHook("vue:error", err, target, info).catch((hookError) => console.error("[nuxt] Error in `vue:error` hook", hookError));
      {
        const p = nuxtApp.runWithContext(() => showError(err));
        onServerPrefetch(() => p);
        return false;
      }
    });
    const islandContext = nuxtApp.ssrContext.islandContext;
    return (_ctx, _push, _parent, _attrs) => {
      ssrRenderSuspense(_push, {
        default: () => {
          if (unref(abortRender)) {
            _push(`<div></div>`);
          } else if (unref(error)) {
            _push(ssrRenderComponent(unref(_sfc_main$1), { error: unref(error) }, null, _parent));
          } else if (unref(islandContext)) {
            _push(ssrRenderComponent(unref(IslandRenderer), { context: unref(islandContext) }, null, _parent));
          } else if (unref(SingleRenderer)) {
            ssrRenderVNode(_push, createVNode(resolveDynamicComponent(unref(SingleRenderer)), null, null), _parent);
          } else {
            _push(ssrRenderComponent(unref(AppComponent), null, null, _parent));
          }
        },
        _: 1
      });
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../node_modules/nuxt/dist/app/components/nuxt-root.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
let entry;
{
  entry = async function createNuxtAppServer(ssrContext) {
    const vueApp = createApp(_sfc_main);
    const nuxt = createNuxtApp({ vueApp, ssrContext });
    try {
      await applyPlugins(nuxt, plugins);
      await nuxt.hooks.callHook("app:created", vueApp);
    } catch (error) {
      await nuxt.hooks.callHook("app:error", error);
      nuxt.payload.error ||= createError(error);
    }
    if (ssrContext?._renderResponse) {
      throw new Error("skipping render");
    }
    return vueApp;
  };
}
const entry_default = (ssrContext) => entry(ssrContext);

export { _export_sfc as _, useNuxtApp as a, useRuntimeConfig as b, nuxtLinkDefaults as c, entry_default as default, navigateTo as n, resolveRouteObject as r, useRouter as u };
//# sourceMappingURL=server.mjs.map
