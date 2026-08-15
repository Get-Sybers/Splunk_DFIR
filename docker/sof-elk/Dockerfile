# syntax=docker/dockerfile:1
#
# SOF-ELK® image for the DX_DFIR pipeline — sources the upstream repo
# (github.com/philhagen/sof-elk) and bakes its Logstash parsing configs into an
# official Logstash image, with Filebeat co-located (as on the SOF-ELK box: Filebeat
# ships the /logstash/<type>/ dirs to Logstash on localhost:5044).
#
# SOF-ELK is normally distributed as a VM; this is a from-source container so the
# dfir_deploy_sofelk role has a real image to run. The compose stack adds
# Elasticsearch + Kibana around it.
#
# Build args:
#   ELASTIC_VERSION  Elastic stack version (default matches SOF-ELK main's pin)
#   SOFELK_REPO/REF  where to source SOF-ELK from
ARG ELASTIC_VERSION=9.4.3

# ---- source the SOF-ELK repo -----------------------------------------------
FROM alpine/git AS src
ARG SOFELK_REPO=https://github.com/philhagen/sof-elk.git
ARG SOFELK_REF=main
RUN git clone --depth 1 --branch "${SOFELK_REF}" "${SOFELK_REPO}" /usr/local/sof-elk \
 && rm -rf /usr/local/sof-elk/.git

# ---- filebeat binaries (co-located into the logstash image) ----------------
ARG ELASTIC_VERSION
FROM docker.elastic.co/beats/filebeat:${ELASTIC_VERSION} AS filebeat

# ---- the SOF-ELK image: Logstash + Filebeat --------------------------------
ARG ELASTIC_VERSION
FROM docker.elastic.co/logstash/logstash:${ELASTIC_VERSION}
USER root

# SOF-ELK's configfiles reference /usr/local/sof-elk/{grok-patterns,supporting-scripts,
# lib/dictionaries} by absolute path, so the repo goes exactly there.
COPY --from=src /usr/local/sof-elk /usr/local/sof-elk
COPY --from=filebeat /usr/share/filebeat /usr/share/filebeat

# Install the non-default Logstash plugins SOF-ELK needs — read from its OWN declared
# list in the cloned repo (ansible/roles/logstash/defaults) so a rebuild always
# tracks upstream instead of drifting from a hardcoded copy.
RUN plugins="$(grep -oE 'logstash-(input|filter|output|codec)-[a-z0-9_]+' \
      /usr/local/sof-elk/ansible/roles/logstash/defaults/main.yaml | sort -u)" \
 && echo "SOF-ELK logstash plugins: ${plugins}" \
 && [ -n "${plugins}" ] \
 && /usr/share/logstash/bin/logstash-plugin install ${plugins}

# SOF-ELK's geoip filters expect the GeoLite2 databases at /usr/local/share/GeoIP/.
# Seed them from the copies the geoip plugin already bundles, so the image is
# config-valid and works out-of-box; operators refresh with a MaxMind license via
# SOF-ELK's geoip_bootstrap.sh.
RUN mkdir -p /usr/local/share/GeoIP \
 && cp /usr/share/logstash/vendor/bundle/jruby/*/gems/logstash-filter-geoip-*/vendor/GeoLite2-*.mmdb \
       /usr/local/share/GeoIP/ \
 && chown -R logstash:root /usr/local/share/GeoIP

# The ES output config hardcodes localhost; make the host overridable so the
# containerised Logstash can reach the elasticsearch service.
RUN sed -i 's|ecs_compatibility => "disabled"|ecs_compatibility => "disabled"\n      hosts => ["${ES_HOSTS:localhost:9200}"]|' \
      /usr/local/sof-elk/configfiles/9900-output-elasticsearch-consolidated.conf

COPY pipelines.yml /usr/share/logstash/config/pipelines.yml
COPY filebeat.yml /usr/share/filebeat/filebeat.yml
COPY entrypoint.sh /usr/local/bin/sof-elk-entrypoint

RUN mkdir -p /logstash /usr/share/filebeat/data \
 && chown -R logstash:root /usr/local/sof-elk /usr/share/filebeat /logstash \
 && chmod 0755 /usr/local/bin/sof-elk-entrypoint

USER logstash
EXPOSE 5044
# Filebeat in the background, then hand off to Logstash's own entrypoint.
ENTRYPOINT ["/usr/local/bin/sof-elk-entrypoint"]
