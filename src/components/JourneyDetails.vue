<template>
  <aside :class="[$style.journeyDetails, { [$style.display]: showJourneyDetails }]">
    <header :class="$style.header">
      <h2 :class="$style.heading">Detaljer</h2>
      <span v-if="!loadingJourneyDetails">
        {{ journey.name }} mot {{ journey.direction }}
      </span>
      <font-awesome
        v-if="loadingJourneyDetails"
        icon="spinner"
        spin/>
      <button
        :class="$style.closeBtn"
        @click.prevent="setShowJourneyDetails(false)">&cross;</button>
    </header>
    <div
      :class="$style.stopList"
      v-if="!loadingJourneyDetails">
      <div
        v-for="stop of stops"
        :key="stop.depTime + stop.name"
        :class="[$style.stop, { [$style.stopPassed]: stop.didPass }]">
        <div :class="$style.stopDotCell"><div :class="$style.stopDot"/></div>
        <div :class="$style.stopTime">
          {{ stop.rtDepTime || stop.depTime }}
        </div>
        <div :class="$style.stopName">{{ stop.name }} {{ stop.didPass }}</div>
        <div :class="$style.stopTrack">{{ stop.track }}</div>
      </div>
    </div>
  </aside>
</template>
<script>
import { mapState, mapMutations } from 'vuex';

export default {
  name: 'JourneyDetails',
  computed: {
    ...mapState(['showJourneyDetails', 'loadingJourneyDetails']),
    journey() {
      const journey = this.$store.state.selectedJourney;
      if (!journey) return {};
      const journeyDir = [].concat(journey.Direction);
      return {
        name: [].concat(journey.JourneyName)[0].name,
        direction: journeyDir[journeyDir.length - 1].$
      };
    },
    stops() {
      const journey = this.$store.state.selectedJourney;
      if (!journey) return [];
      const now = Date.now();
      return journey.Stop.map((stop) => {
        const departed = new Date(`${stop.depDate}T${stop.depTime}`).getTime();
        return {
          ...stop,
          didPass: departed < now
        };
      });
    }
  },
  methods: {
    ...mapMutations(['setShowJourneyDetails'])
  }
};
</script>
<style module>
.journeyDetails {
  background: white;
  color: var(--dark-text-color);
  display: none;
  width: 100%;
}
.display {
  display: block;
}

.header {
  background: var(--brand-color);
  border-left: 1px solid var(--brand-text-color);
  color: var(--brand-text-color);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-left: 1em;
}
.heading {
  font-size: 1em;
  font-weight: bold;
  margin: 0;
}
.closeBtn {
  background: transparent;
  border: none;
  color: var(--brand-text-color);
  cursor: pointer;
  font-size: 1em;
  padding: 0.5em 1em;
}

.stopList {
}
.stop {
  display: flex;
  align-items: stretch;
  line-height: 2em;
  padding: 0 1em 0 0.5em;
}
.stop > div:not(:first-child) {
  border-bottom: 1px solid lightgray;
  padding: 0 0.5em;
}
.stop > div:last-child {
  padding-right: 0;
}
.stop:last-child > div {
  border-bottom: none;
}

.stopDotCell {
  flex-shrink: 0;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 0.5em;
}
.stopDot {
  background: lightblue;
  border-radius: 50%;
  width: 8px;
  height: 8px;
}
.stopDot:before,
.stopDot:after {
  background: lightblue;
  display: block;
  content: '';
  width: 4px;
  height: 50%;
  position: absolute;
  top: 0;
  left: calc(50% - 2px);
}
.stopDot:after {
  top: 50%;
}
.stop:first-child .stopDot:before {
  height: 0;
}
.stop:last-child .stopDot:after {
  height: 0;
}
.stopPassed .stopDot {
  background: blue;
}
.stopPassed .stopDot:before,
.stopPassed .stopDot:after {
  background: blue;
}

.stopTime {
  flex-basis: 60px;
  flex-shrink: 0;
}
.stopName {
  flex-grow: 1;
  text-align: left;
}
.stopTrack {
  text-align: right;
}
</style>