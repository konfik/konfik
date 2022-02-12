import type { Clock } from '@effect-ts/core/Effect/Clock'
import { LiveSimpleProcessor, makeOTLPTraceExporterConfigLayer } from '@effect-ts/otel-exporter-trace-otlp-http'
import * as OTNode from '@effect-ts/otel-sdk-trace-node'
import { Resource } from '@opentelemetry/resources'
import { SemanticResourceAttributes } from '@opentelemetry/semantic-conventions'

import type { Has } from '../index.js'
import { L, OT, T } from '../index.js'

export { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http'
export { Resource } from '@opentelemetry/resources'
export { SemanticResourceAttributes } from '@opentelemetry/semantic-conventions'
//
// Jaeger Tracer (via Grpc Collector)
//

const makeNodeTracingProvider = (serviceName: string) =>
  OTNode.NodeProvider({
    resource: new Resource({ [SemanticResourceAttributes.SERVICE_NAME]: serviceName }),
  })

const CollectorConfig = makeOTLPTraceExporterConfigLayer({})

export const makeJaegerNodeTracingLayer = (serviceName: string): L.Layer<Has<Clock>, never, OT.HasTracer> =>
  CollectorConfig['>+>'](OT.LiveTracer['<<<'](makeNodeTracingProvider(serviceName)['>+>'](LiveSimpleProcessor)))

export const provideJaegerTracing = (serviceName: string) => T.provideSomeLayer(makeJaegerNodeTracingLayer(serviceName))

//
// Dummy Tracer
//

const dummyProps = {} as any

export const dummyTracing = (): OT.Tracer => ({
  [OT.TracerSymbol]: OT.TracerSymbol,
  tracer: {
    startSpan: () => ({
      setAttribute: () => null,
      setStatus: () => null,
      end: () => null,
    }),
    ...dummyProps,
  },
})

export const LiveDummyTracing: L.Layer<Has<Clock>, never, OT.HasTracer> = L.fromFunction(OT.Tracer)(dummyTracing)

export const provideDummyTracing = () => T.provideSomeLayer(LiveDummyTracing)
