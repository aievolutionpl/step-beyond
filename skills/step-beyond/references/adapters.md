# Adapter Contract

Adapters map host capabilities without changing `SPEC.md` semantics.

The runtime capability surface is:

```text
read_context
read_project
execute_local
request_permission
publish_external
read_user_model
write_user_model
record_evidence
```

Detect capabilities once and cache the result. Missing capabilities return an
explicit degraded result. Local execution and external publication are separate;
publication requires a permission reference.

Host labels:

- `planned`: documentation only;
- `prompt-only`: portable instruction tested, no runtime enforcement;
- `runtime-backed`: adapter connected to the controller;
- `verified`: repeated adapter-specific behavioral tests passed.

Do not list a host as verified from package readiness, a documentation example,
or a single model run.
