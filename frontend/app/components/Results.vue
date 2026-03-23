<template>
    <div class="bg-gradient-to-br from-green-600 to-emerald-600 rounded-lg shadow-lg p-8 mt-8 text-white">
    <div class="flex items-center justify-between">
      <div>
        <p class="text-green-100 mb-2">Primary Genre Detected</p>
        <h2 class="text-4xl mb-2">🎵 {{ data.genre }}</h2>
        <p class="text-green-100">{{ data.percentages[data.genre] }}% confidence</p>
      </div>
      <div class="bg-white/20 p-6 rounded-lg backdrop-blur-sm">
        <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-music2 lucide-music-2 text-white">
          <circle cx="8" cy="18" r="4"></circle>
          <path d="M12 18V2l7 4"></path>
        </svg>
      </div>
    </div>
  </div>

  <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-">
    <div class="bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-700 mt-6">
      <div class="flex items-center gap-3 mb-6">
        <div class="bg-green-900 p-2 rounded-lg">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-layers text-green-400">
            <path d="M12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83z"></path>
            <path d="M2 12a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 12"></path>
            <path d="M2 17a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 17"></path>
          </svg>
        </div>
        <div>
          <h3 class="text-white">Genre Distribution</h3>
          <p class="text-gray-400">All detected genres</p>
        </div>
      </div>
      <div class="space-y-4">
        <div v-for="(percentage, genre) in data.percentages" :key="genre" class="space-y-2">
          <div class="flex justify-between items-center">
            <span class="text-gray-200" :class="{ 'text-yellow-400': genre === data.genre }">{{ genre === data.genre ? 'TOP: ' : '' }}{{ genre }}</span>
            <span class="font-medium text-white">{{ percentage }}%</span>
          </div>
          <div class="w-full bg-gray-700 rounded-full h-3 overflow-hidden">
            <div class="h-full rounded-full transition-all duration-1000 bg-gradient-to-r from-green-500 to-emerald-500" :style="{ width: `${percentage}%` }"></div>
          </div>
        </div>
      </div>
    </div>
      <div class="bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-700 mt-6">
    <div class="flex items-center gap-3 mb-6">
      <div class="bg-green-900 p-2 rounded-lg">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-file-audio text-green-400">
          <path d="M17.5 22h.5a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v3"></path>
          <path d="M14 2v4a2 2 0 0 0 2 2h4"></path>
          <path d="M2 19a2 2 0 1 1 4 0v1a2 2 0 1 1-4 0v-4a6 6 0 0 1 12 0v4a2 2 0 1 1-4 0v-1a2 2 0 1 1 4 0"></path>
        </svg>
      </div>
      <div>
        <h3 class="text-white">Audio Information</h3>
        <p class="text-gray-400 truncate">{{ data.filename }}</p>
      </div>
    </div>
    <div class="space-y-4">
      <div class="flex items-center justify-between p-3 bg-gray-900 rounded-lg">
        <div class="flex items-center gap-3">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-clock text-green-400">
            <circle cx="12" cy="12" r="10"></circle>
            <polyline points="12 6 12 12 16 14"></polyline>
          </svg>
          <span class="text-gray-300">Duration</span>
        </div>
        <span class="text-white font-medium">{{ formatDuration(data.audio_metadata.duration) }}</span>
      </div>
      <div class="flex items-center justify-between p-3 bg-gray-900 rounded-lg">
        <div class="flex items-center gap-3">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-radio text-green-400">
            <path d="M4.9 19.1C1 15.2 1 8.8 4.9 4.9"></path>
            <path d="M7.8 16.2c-2.3-2.3-2.3-6.1 0-8.5"></path>
            <circle cx="12" cy="12" r="2"></circle>
            <path d="M16.2 7.8c2.3 2.3 2.3 6.1 0 8.5"></path>
            <path d="M19.1 4.9C23 8.8 23 15.1 19.1 19"></path>
          </svg>
          <span class="text-gray-300">Sample Rate</span>
        </div>
        <span class="text-white font-medium">{{ data.audio_metadata.sample_rate.toLocaleString() }} Hz</span>
      </div>
      <div class="flex items-center justify-between p-3 bg-gray-900 rounded-lg">
        <div class="flex items-center gap-3">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-layers text-green-400">
            <path d="M12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83z"></path>
            <path d="M2 12a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 12"></path>
            <path d="M2 17a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 17"></path>
          </svg>
          <span class="text-gray-300">Total Segments</span>
        </div>
        <span class="text-white font-medium">{{ data.audio_metadata.total_segments }}</span>
      </div>
      <div class="flex items-center justify-between p-3 bg-gray-900 rounded-lg">
        <div class="flex items-center gap-3">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-activity text-green-400">
            <path d="M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2"></path>
          </svg>
          <span class="text-gray-300">Segment Duration</span>
        </div>
        <span class="text-white font-medium">{{ data.audio_metadata.segment_duration }}.00s</span>
      </div>
    </div>
  </div>
  </div>

  <div class="bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-700 mt-6">
    <div class="flex items-center gap-3 mb-6">
      <div class="bg-green-900 p-2 rounded-lg">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-activity text-green-400">
          <path d="M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2"></path>
        </svg>
      </div>
      <div>
        <h3 class="text-white">RMS Loudness Over Time</h3>
        <p class="text-gray-400">Audio intensity analysis</p>
      </div>
    </div>
    <div class="h-64 w-full">
      <div class="recharts-responsive-container" style="width: 100%; height: 100%; min-width: 0;">
        <div class="recharts-wrapper" style="position: relative; cursor: default; width: 100%; height: 100%; max-height: 256px; max-width: 100%;">
          <svg class="recharts-surface flex items-center" width="100%" height="256" viewBox="65 0 687 256" style="width: 100%; height: 100%;">
            <title></title>
            <desc></desc>
            <defs>
              <clipPath id="recharts1-clip">
                <rect x="65" y="5" height="216" width="687"></rect>
              </clipPath>
            </defs>
            <defs>
              <linearGradient id="loudnessGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stop-color="#10b981" stop-opacity="0.8"></stop>
                <stop offset="95%" stop-color="#10b981" stop-opacity="0.1"></stop>
              </linearGradient>
            </defs>
            <g class="recharts-cartesian-grid">
              <g class="recharts-cartesian-grid-horizontal">
                <line stroke-dasharray="3 3" stroke="#374151" fill="none" x="65" y="5" width="687" height="216" x1="65" y1="221" x2="752" y2="221"></line>
                <line stroke-dasharray="3 3" stroke="#374151" fill="none" x="65" y="5" width="687" height="216" x1="65" y1="167" x2="752" y2="167"></line>
                <line stroke-dasharray="3 3" stroke="#374151" fill="none" x="65" y="5" width="687" height="216" x1="65" y1="113" x2="752" y2="113"></line>
                <line stroke-dasharray="3 3" stroke="#374151" fill="none" x="65" y="5" width="687" height="216" x1="65" y1="59" x2="752" y2="59"></line>
                <line stroke-dasharray="3 3" stroke="#374151" fill="none" x="65" y="5" width="687" height="216" x1="65" y1="5" x2="752" y2="5"></line>
              </g>
              <g class="recharts-cartesian-grid-vertical">
                <line stroke-dasharray="3 3" stroke="#374151" fill="none" x="65" y="5" width="687" height="216" x1="79.0204081632653" y1="5" x2="79.0204081632653" y2="221"></line>
                <line stroke-dasharray="3 3" stroke="#374151" fill="none" x="65" y="5" width="687" height="216" x1="107.06122448979592" y1="5" x2="107.06122448979592" y2="221"></line>
                <line stroke-dasharray="3 3" stroke="#374151" fill="none" x="65" y="5" width="687" height="216" x1="149.12244897959184" y1="5" x2="149.12244897959184" y2="221"></line>
                <line stroke-dasharray="3 3" stroke="#374151" fill="none" x="65" y="5" width="687" height="216" x1="191.18367346938777" y1="5" x2="191.18367346938777" y2="221"></line>
                <line stroke-dasharray="3 3" stroke="#374151" fill="none" x="65" y="5" width="687" height="216" x1="233.24489795918367" y1="5" x2="233.24489795918367" y2="221"></line>
                <line stroke-dasharray="3 3" stroke="#374151" fill="none" x="65" y="5" width="687" height="216" x1="275.30612244897964" y1="5" x2="275.30612244897964" y2="221"></line>
                <line stroke-dasharray="3 3" stroke="#374151" fill="none" x="65" y="5" width="687" height="216" x1="317.36734693877554" y1="5" x2="317.36734693877554" y2="221"></line>
                <line stroke-dasharray="3 3" stroke="#374151" fill="none" x="65" y="5" width="687" height="216" x1="359.42857142857144" y1="5" x2="359.42857142857144" y2="221"></line>
                <line stroke-dasharray="3 3" stroke="#374151" fill="none" x="65" y="5" width="687" height="216" x1="401.48979591836735" y1="5" x2="401.48979591836735" y2="221"></line>
                <line stroke-dasharray="3 3" stroke="#374151" fill="none" x="65" y="5" width="687" height="216" x1="443.5510204081633" y1="5" x2="443.5510204081633" y2="221"></line>
                <line stroke-dasharray="3 3" stroke="#374151" fill="none" x="65" y="5" width="687" height="216" x1="485.6122448979592" y1="5" x2="485.6122448979592" y2="221"></line>
                <line stroke-dasharray="3 3" stroke="#374151" fill="none" x="65" y="5" width="687" height="216" x1="527.6734693877552" y1="5" x2="527.6734693877552" y2="221"></line>
                <line stroke-dasharray="3 3" stroke="#374151" fill="none" x="65" y="5" width="687" height="216" x1="569.7346938775511" y1="5" x2="569.7346938775511" y2="221"></line>
                <line stroke-dasharray="3 3" stroke="#374151" fill="none" x="65" y="5" width="687" height="216" x1="625.8163265306123" y1="5" x2="625.8163265306123" y2="221"></line>
                <line stroke-dasharray="3 3" stroke="#374151" fill="none" x="65" y="5" width="687" height="216" x1="681.8979591836735" y1="5" x2="681.8979591836735" y2="221"></line>
                <line stroke-dasharray="3 3" stroke="#374151" fill="none" x="65" y="5" width="687" height="216" x1="752" y1="5" x2="752" y2="221"></line>
                <line stroke-dasharray="3 3" stroke="#374151" fill="none" x="65" y="5" width="687" height="216" x1="65" y1="5" x2="65" y2="221"></line>
              </g>
            </g>
            <g class="recharts-layer recharts-cartesian-axis recharts-xAxis xAxis">
              <line orientation="bottom" width="687" height="30" stroke="#9ca3af" x="65" y="221" class="recharts-cartesian-axis-line" fill="none" x1="65" y1="221" x2="752" y2="221"></line>
              <g class="recharts-cartesian-axis-ticks">
                <g class="recharts-layer recharts-cartesian-axis-tick">
                  <line orientation="bottom" width="687" height="30" stroke="#9ca3af" x="65" y="221" class="recharts-cartesian-axis-tick-line" fill="none" x1="79.0204081632653" y1="227" x2="79.0204081632653" y2="221"></line>
                  <text orientation="bottom" width="687" height="30" stroke="none" x="79.0204081632653" y="229" class="recharts-text recharts-cartesian-axis-tick-value" text-anchor="middle" fill="#9ca3af">
                    <tspan x="79.0204081632653" dy="0.71em">3.0</tspan>
                  </text>
                </g>
                <g class="recharts-layer recharts-cartesian-axis-tick">
                  <line orientation="bottom" width="687" height="30" stroke="#9ca3af" x="65" y="221" class="recharts-cartesian-axis-tick-line" fill="none" x1="107.06122448979592" y1="227" x2="107.06122448979592" y2="221"></line>
                  <text orientation="bottom" width="687" height="30" stroke="none" x="107.06122448979592" y="229" class="recharts-text recharts-cartesian-axis-tick-value" text-anchor="middle" fill="#9ca3af">
                    <tspan x="107.06122448979592" dy="0.71em">9.0</tspan>
                  </text>
                </g>
                <g class="recharts-layer recharts-cartesian-axis-tick">
                  <line orientation="bottom" width="687" height="30" stroke="#9ca3af" x="65" y="221" class="recharts-cartesian-axis-tick-line" fill="none" x1="149.12244897959184" y1="227" x2="149.12244897959184" y2="221"></line>
                  <text orientation="bottom" width="687" height="30" stroke="none" x="149.12244897959184" y="229" class="recharts-text recharts-cartesian-axis-tick-value" text-anchor="middle" fill="#9ca3af">
                    <tspan x="149.12244897959184" dy="0.71em">18.0</tspan>
                  </text>
                </g>
                <g class="recharts-layer recharts-cartesian-axis-tick">
                  <line orientation="bottom" width="687" height="30" stroke="#9ca3af" x="65" y="221" class="recharts-cartesian-axis-tick-line" fill="none" x1="191.18367346938777" y1="227" x2="191.18367346938777" y2="221"></line>
                  <text orientation="bottom" width="687" height="30" stroke="none" x="191.18367346938777" y="229" class="recharts-text recharts-cartesian-axis-tick-value" text-anchor="middle" fill="#9ca3af">
                    <tspan x="191.18367346938777" dy="0.71em">27.0</tspan>
                  </text>
                </g>
                <g class="recharts-layer recharts-cartesian-axis-tick">
                  <line orientation="bottom" width="687" height="30" stroke="#9ca3af" x="65" y="221" class="recharts-cartesian-axis-tick-line" fill="none" x1="233.24489795918367" y1="227" x2="233.24489795918367" y2="221"></line>
                  <text orientation="bottom" width="687" height="30" stroke="none" x="233.24489795918367" y="229" class="recharts-text recharts-cartesian-axis-tick-value" text-anchor="middle" fill="#9ca3af">
                    <tspan x="233.24489795918367" dy="0.71em">36.0</tspan>
                  </text>
                </g>
                <g class="recharts-layer recharts-cartesian-axis-tick">
                  <line orientation="bottom" width="687" height="30" stroke="#9ca3af" x="65" y="221" class="recharts-cartesian-axis-tick-line" fill="none" x1="275.30612244897964" y1="227" x2="275.30612244897964" y2="221"></line>
                  <text orientation="bottom" width="687" height="30" stroke="none" x="275.30612244897964" y="229" class="recharts-text recharts-cartesian-axis-tick-value" text-anchor="middle" fill="#9ca3af">
                    <tspan x="275.30612244897964" dy="0.71em">45.0</tspan>
                  </text>
                </g>
                <g class="recharts-layer recharts-cartesian-axis-tick">
                  <line orientation="bottom" width="687" height="30" stroke="#9ca3af" x="65" y="221" class="recharts-cartesian-axis-tick-line" fill="none" x1="317.36734693877554" y1="227" x2="317.36734693877554" y2="221"></line>
                  <text orientation="bottom" width="687" height="30" stroke="none" x="317.36734693877554" y="229" class="recharts-text recharts-cartesian-axis-tick-value" text-anchor="middle" fill="#9ca3af">
                    <tspan x="317.36734693877554" dy="0.71em">54.0</tspan>
                  </text>
                </g>
                <g class="recharts-layer recharts-cartesian-axis-tick">
                  <line orientation="bottom" width="687" height="30" stroke="#9ca3af" x="65" y="221" class="recharts-cartesian-axis-tick-line" fill="none" x1="359.42857142857144" y1="227" x2="359.42857142857144" y2="221"></line>
                  <text orientation="bottom" width="687" height="30" stroke="none" x="359.42857142857144" y="229" class="recharts-text recharts-cartesian-axis-tick-value" text-anchor="middle" fill="#9ca3af">
                    <tspan x="359.42857142857144" dy="0.71em">63.0</tspan>
                  </text>
                </g>
                <g class="recharts-layer recharts-cartesian-axis-tick">
                  <line orientation="bottom" width="687" height="30" stroke="#9ca3af" x="65" y="221" class="recharts-cartesian-axis-tick-line" fill="none" x1="401.48979591836735" y1="227" x2="401.48979591836735" y2="221"></line>
                  <text orientation="bottom" width="687" height="30" stroke="none" x="401.48979591836735" y="229" class="recharts-text recharts-cartesian-axis-tick-value" text-anchor="middle" fill="#9ca3af">
                    <tspan x="401.48979591836735" dy="0.71em">72.0</tspan>
                  </text>
                </g>
                <g class="recharts-layer recharts-cartesian-axis-tick">
                  <line orientation="bottom" width="687" height="30" stroke="#9ca3af" x="65" y="221" class="recharts-cartesian-axis-tick-line" fill="none" x1="443.5510204081633" y1="227" x2="443.5510204081633" y2="221"></line>
                  <text orientation="bottom" width="687" height="30" stroke="none" x="443.5510204081633" y="229" class="recharts-text recharts-cartesian-axis-tick-value" text-anchor="middle" fill="#9ca3af">
                    <tspan x="443.5510204081633" dy="0.71em">81.0</tspan>
                  </text>
                </g>
                <g class="recharts-layer recharts-cartesian-axis-tick">
                  <line orientation="bottom" width="687" height="30" stroke="#9ca3af" x="65" y="221" class="recharts-cartesian-axis-tick-line" fill="none" x1="485.6122448979592" y1="227" x2="485.6122448979592" y2="221"></line>
                  <text orientation="bottom" width="687" height="30" stroke="none" x="485.6122448979592" y="229" class="recharts-text recharts-cartesian-axis-tick-value" text-anchor="middle" fill="#9ca3af">
                    <tspan x="485.6122448979592" dy="0.71em">90.0</tspan>
                  </text>
                </g>
                <g class="recharts-layer recharts-cartesian-axis-tick">
                  <line orientation="bottom" width="687" height="30" stroke="#9ca3af" x="65" y="221" class="recharts-cartesian-axis-tick-line" fill="none" x1="527.6734693877552" y1="227" x2="527.6734693877552" y2="221"></line>
                  <text orientation="bottom" width="687" height="30" stroke="none" x="527.6734693877552" y="229" class="recharts-text recharts-cartesian-axis-tick-value" text-anchor="middle" fill="#9ca3af">
                    <tspan x="527.6734693877552" dy="0.71em">99.0</tspan>
                  </text>
                </g>
                <g class="recharts-layer recharts-cartesian-axis-tick">
                  <line orientation="bottom" width="687" height="30" stroke="#9ca3af" x="65" y="221" class="recharts-cartesian-axis-tick-line" fill="none" x1="569.7346938775511" y1="227" x2="569.7346938775511" y2="221"></line>
                  <text orientation="bottom" width="687" height="30" stroke="none" x="569.7346938775511" y="229" class="recharts-text recharts-cartesian-axis-tick-value" text-anchor="middle" fill="#9ca3af">
                    <tspan x="569.7346938775511" dy="0.71em">108.0</tspan>
                  </text>
                </g>
                <g class="recharts-layer recharts-cartesian-axis-tick">
                  <line orientation="bottom" width="687" height="30" stroke="#9ca3af" x="65" y="221" class="recharts-cartesian-axis-tick-line" fill="none" x1="625.8163265306123" y1="227" x2="625.8163265306123" y2="221"></line>
                  <text orientation="bottom" width="687" height="30" stroke="none" x="625.8163265306123" y="229" class="recharts-text recharts-cartesian-axis-tick-value" text-anchor="middle" fill="#9ca3af">
                    <tspan x="625.8163265306123" dy="0.71em">120.0</tspan>
                  </text>
                </g>
                <g class="recharts-layer recharts-cartesian-axis-tick">
                  <line orientation="bottom" width="687" height="30" stroke="#9ca3af" x="65" y="221" class="recharts-cartesian-axis-tick-line" fill="none" x1="681.8979591836735" y1="227" x2="681.8979591836735" y2="221"></line>
                  <text orientation="bottom" width="687" height="30" stroke="none" x="681.8979591836735" y="229" class="recharts-text recharts-cartesian-axis-tick-value" text-anchor="middle" fill="#9ca3af">
                    <tspan x="681.8979591836735" dy="0.71em">132.0</tspan>
                  </text>
                </g>
                <g class="recharts-layer recharts-cartesian-axis-tick">
                  <line orientation="bottom" width="687" height="30" stroke="#9ca3af" x="65" y="221" class="recharts-cartesian-axis-tick-line" fill="none" x1="752" y1="227" x2="752" y2="221"></line>
                  <text orientation="bottom" width="687" height="30" stroke="none" x="736.9765625" y="229" class="recharts-text recharts-cartesian-axis-tick-value" text-anchor="middle" fill="#9ca3af">
                    <tspan x="736.9765625" dy="0.71em">147.0</tspan>
                  </text>
                </g>
              </g>
              <text offset="-5" x="408.5" y="256" class="recharts-text recharts-label" text-anchor="middle" fill="#9ca3af">
                <tspan x="408.5" dy="=5em">Time (seconds)</tspan>
              </text>
            </g>
            <g class="recharts-layer recharts-cartesian-axis recharts-yAxis yAxis">
              <line orientation="left" width="60" height="216" stroke="#9ca3af" x="5" y="5" class="recharts-cartesian-axis-line" fill="none" x1="65" y1="5" x2="65" y2="221"></line>
              <g class="recharts-cartesian-axis-ticks">
                <g class="recharts-layer recharts-cartesian-axis-tick">
                  <line orientation="left" width="60" height="216" stroke="#9ca3af" x="5" y="5" class="recharts-cartesian-axis-tick-line" fill="none" x1="59" y1="221" x2="65" y2="221"></line>
                  <text orientation="left" width="60" height="216" stroke="none" x="57" y="221" class="recharts-text recharts-cartesian-axis-tick-value" text-anchor="end" fill="#9ca3af">
                    <tspan x="57" dy="0.355em">0</tspan>
                  </text>
                </g>
                <g class="recharts-layer recharts-cartesian-axis-tick">
                  <line orientation="left" width="60" height="216" stroke="#9ca3af" x="5" y="5" class="recharts-cartesian-axis-tick-line" fill="none" x1="59" y1="167" x2="65" y2="167"></line>
                  <text orientation="left" width="60" height="216" stroke="none" x="57" y="167" class="recharts-text recharts-cartesian-axis-tick-value" text-anchor="end" fill="#9ca3af">
                    <tspan x="57" dy="0.355em">0.15</tspan>
                  </text>
                </g>
                <g class="recharts-layer recharts-cartesian-axis-tick">
                  <line orientation="left" width="60" height="216" stroke="#9ca3af" x="5" y="5" class="recharts-cartesian-axis-tick-line" fill="none" x1="59" y1="113" x2="65" y2="113"></line>
                  <text orientation="left" width="60" height="216" stroke="none" x="57" y="113" class="recharts-text recharts-cartesian-axis-tick-value" text-anchor="end" fill="#9ca3af">
                    <tspan x="57" dy="0.355em">0.3</tspan>
                  </text>
                </g>
                <g class="recharts-layer recharts-cartesian-axis-tick">
                  <line orientation="left" width="60" height="216" stroke="#9ca3af" x="5" y="5" class="recharts-cartesian-axis-tick-line" fill="none" x1="59" y1="59" x2="65" y2="59"></line>
                  <text orientation="left" width="60" height="216" stroke="none" x="57" y="59" class="recharts-text recharts-cartesian-axis-tick-value" text-anchor="end" fill="#9ca3af">
                    <tspan x="57" dy="0.355em">0.45</tspan>
                  </text>
                </g>
                <g class="recharts-layer recharts-cartesian-axis-tick">
                  <line orientation="left" width="60" height="216" stroke="#9ca3af" x="5" y="5" class="recharts-cartesian-axis-tick-line" fill="none" x1="59" y1="5" x2="65" y2="5"></line>
                  <text orientation="left" width="60" height="216" stroke="none" x="57" y="12" class="recharts-text recharts-cartesian-axis-tick-value" text-anchor="end" fill="#9ca3af">
                    <tspan x="57" dy="0.355em">0.6</tspan>
                  </text>
                </g>
              </g>
              <text offset="5" transform="rotate(-90, 10, 113)" x="10" y="113" class="recharts-text recharts-label" text-anchor="start" fill="#9ca3af">
                <tspan x="0" dy="0.355em">RMS Loudness</tspan>
              </text>
            </g>
            <g class="recharts-layer recharts-area">
              <g class="recharts-layer">
                <defs>
                  <clipPath id="animationClipPath-recharts-area-3">
                    <rect x="65" y="0" width="1000" height="223"></rect>
                  </clipPath>
                </defs>
                <g class="recharts-layer" clip-path="url(#animationClipPath-recharts-area-3)">
                  <g class="recharts-layer">
                    <path stroke-width="2" fill="url(#loudnessGradient)" fill-opacity="0.6" width="687" height="216" stroke="none" class="recharts-curve recharts-area-area" d="M65,130.69C69.673,105.112,74.347,79.534,79.02,79.534C83.694,79.534,88.367,102.006,93.041,102.006C97.714,102.006,102.388,87.958,107.061,87.958C111.735,87.958,116.408,98.923,121.082,114.933C125.755,130.943,130.429,184.018,135.102,184.018C139.776,184.018,144.449,165.453,149.122,154.509C153.796,143.566,158.469,135.579,163.143,118.358C167.816,101.136,172.49,51.18,177.163,51.18C181.837,51.18,186.51,62.816,191.184,81.495C195.857,100.175,200.531,163.257,205.204,163.257C209.878,163.257,214.551,158.534,219.224,149.088C223.898,139.643,228.571,54.487,233.245,54.487C237.918,54.487,242.592,167.36,247.265,167.36C251.939,167.36,256.612,110.028,261.286,110.028C265.959,110.028,270.633,156.796,275.306,156.796C279.98,156.796,284.653,122.313,289.327,102.217C294,82.121,298.673,52.239,303.347,36.219C308.02,20.199,312.694,6.096,317.367,6.096C322.041,6.096,326.714,24.513,331.388,50.132C336.061,75.751,340.735,159.812,345.408,159.812C350.082,159.812,354.755,101.382,359.429,77.911C364.102,54.44,368.776,18.988,373.449,18.988C378.122,18.988,382.796,57.19,387.469,69.686C392.143,82.182,396.816,93.965,401.49,93.965C406.163,93.965,410.837,83.735,415.51,71.612C420.184,59.489,424.857,27.398,429.531,21.227C434.204,15.057,438.878,11.972,443.551,11.972C448.224,11.972,452.898,59.77,457.571,87.287C462.245,114.805,466.918,172.169,471.592,177.078C476.265,181.988,480.939,184.443,485.612,184.443C490.286,184.443,494.959,18.324,499.633,18.324C504.306,18.324,508.98,133.171,513.653,150.776C518.327,168.381,523,177.183,527.673,177.183C532.347,177.183,537.02,34.165,541.694,34.165C546.367,34.165,551.041,50.059,555.714,67.598C560.388,85.137,565.061,134.609,569.735,139.398C574.408,144.188,579.082,146.583,583.755,146.583C588.429,146.583,593.102,51.271,597.776,51.271C602.449,51.271,607.122,123.705,611.796,123.705C616.469,123.705,621.143,105.276,625.816,105.276C630.49,105.276,635.163,127.35,639.837,135.53C644.51,143.71,649.184,149.861,653.857,154.354C658.531,158.848,663.204,162.489,667.878,162.489C672.551,162.489,677.224,56.799,681.898,56.799C686.571,56.799,691.245,180.278,695.918,180.278C700.592,180.278,705.265,9.727,709.939,9.727C714.612,9.727,719.286,126.413,723.959,126.413C728.633,126.413,733.306,26.459,737.98,26.459C742.653,26.459,747.327,71.933,752,117.406L752,221C747.327,221,742.653,221,737.98,221C733.306,221,728.633,221,723.959,221C719.286,221,714.612,221,709.939,221C705.265,221,700.592,221,695.918,221C691.245,221,686.571,221,681.898,221C677.224,221,672.551,221,667.878,221C663.204,221,658.531,221,653.857,221C649.184,221,644.51,221,639.837,221C635.163,221,630.49,221,625.816,221C621.143,221,616.469,221,611.796,221C607.122,221,602.449,221,597.776,221C593.102,221,588.429,221,583.755,221C579.082,221,574.408,221,569.735,221C565.061,221,560.388,221,555.714,221C551.041,221,546.367,221,541.694,221C537.02,221,532.347,221,527.673,221C523,221,518.327,221,513.653,221C508.98,221,504.306,221,499.633,221C494.959,221,490.286,221,485.612,221C480.939,221,476.265,221,471.592,221C466.918,221,462.245,221,457.571,221C452.898,221,448.224,221,443.551,221C438.878,221,434.204,221,429.531,221C424.857,221,420.184,221,415.51,221C410.837,221,406.163,221,401.49,221C396.816,221,392.143,221,387.469,221C382.796,221,378.122,221,373.449,221C368.776,221,364.102,221,359.429,221C354.755,221,350.082,221,345.408,221C340.735,221,336.061,221,331.388,221C326.714,221,322.041,221,317.367,221C312.694,221,308.02,221,303.347,221C298.673,221,294,221,289.327,221C284.653,221,279.98,221,275.306,221C270.633,221,265.959,221,261.286,221C256.612,221,251.939,221,247.265,221C242.592,221,237.918,221,233.245,221C228.571,221,223.898,221,219.224,221C214.551,221,209.878,221,205.204,221C200.531,221,195.857,221,191.184,221C186.51,221,181.837,221,177.163,221C172.49,221,167.816,221,163.143,221C158.469,221,153.796,221,149.122,221C144.449,221,139.776,221,135.102,221C130.429,221,125.755,221,121.082,221C116.408,221,111.735,221,107.061,221C102.388,221,97.714,221,93.041,221C88.367,221,83.694,221,79.02,221C74.347,221,69.673,221,65,221Z"></path>
                    <path stroke="#10b981" stroke-width="2" fill="none" class="recharts-curve recharts-area-curve" d="M65,130.69C69.673,105.112,74.347,79.534,79.02,79.534C83.694,79.534,88.367,102.006,93.041,102.006C97.714,102.006,102.388,87.958,107.061,87.958C111.735,87.958,116.408,98.923,121.082,114.933C125.755,130.943,130.429,184.018,135.102,184.018C139.776,184.018,144.449,165.453,149.122,154.509C153.796,143.566,158.469,135.579,163.143,118.358C167.816,101.136,172.49,51.18,177.163,51.18C181.837,51.18,186.51,62.816,191.184,81.495C195.857,100.175,200.531,163.257,205.204,163.257C209.878,163.257,214.551,158.534,219.224,149.088C223.898,139.643,228.571,54.487,233.245,54.487C237.918,54.487,242.592,167.36,247.265,167.36C251.939,167.36,256.612,110.028,261.286,110.028C265.959,110.028,270.633,156.796,275.306,156.796C279.98,156.796,284.653,122.313,289.327,102.217C294,82.121,298.673,52.239,303.347,36.219C308.02,20.199,312.694,6.096,317.367,6.096C322.041,6.096,326.714,24.513,331.388,50.132C336.061,75.751,340.735,159.812,345.408,159.812C350.082,159.812,354.755,101.382,359.429,77.911C364.102,54.44,368.776,18.988,373.449,18.988C378.122,18.988,382.796,57.19,387.469,69.686C392.143,82.182,396.816,93.965,401.49,93.965C406.163,93.965,410.837,83.735,415.51,71.612C420.184,59.489,424.857,27.398,429.531,21.227C434.204,15.057,438.878,11.972,443.551,11.972C448.224,11.972,452.898,59.77,457.571,87.287C462.245,114.805,466.918,172.169,471.592,177.078C476.265,181.988,480.939,184.443,485.612,184.443C490.286,184.443,494.959,18.324,499.633,18.324C504.306,18.324,508.98,133.171,513.653,150.776C518.327,168.381,523,177.183,527.673,177.183C532.347,177.183,537.02,34.165,541.694,34.165C546.367,34.165,551.041,50.059,555.714,67.598C560.388,85.137,565.061,134.609,569.735,139.398C574.408,144.188,579.082,146.583,583.755,146.583C588.429,146.583,593.102,51.271,597.776,51.271C602.449,51.271,607.122,123.705,611.796,123.705C616.469,123.705,621.143,105.276,625.816,105.276C630.49,105.276,635.163,127.35,639.837,135.53C644.51,143.71,649.184,149.861,653.857,154.354C658.531,158.848,663.204,162.489,667.878,162.489C672.551,162.489,677.224,56.799,681.898,56.799C686.571,56.799,691.245,180.278,695.918,180.278C700.592,180.278,705.265,9.727,709.939,9.727C714.612,9.727,719.286,126.413,723.959,126.413C728.633,126.413,733.306,26.459,737.98,26.459C742.653,26.459,747.327,71.933,752,117.406"></path>
                  </g>
                </g>
              </g>
            </g>
          </svg>
        </div>
      </div>
    </div>
  </div>

  <div class="bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-700 mt-6">
    <div class="flex items-center gap-3 mb-6">
      <div class="bg-green-900 p-2 rounded-lg">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-bar-chart text-green-400">
          <path d="M12 2v20M2 12h20M7 7h10M7 17h10"></path>
        </svg>
      </div>
      <div>
        <h3 class="text-white">Spectrogram</h3>
        <p class="text-gray-400">Frequency analysis over time</p>
      </div>
    </div>
    <div class="flex justify-center">
      <img :src="`data:image/png;base64,${data.spectrogram}`" alt="Spectrogram" class="max-w-full h-auto rounded-lg" />
    </div>
  </div>
</template>

<script setup lang="ts">
  interface Props {
    data: {
      genre: string
      percentages: Record<string, number>
      filename: string
      audio_metadata: {
        duration: number
        sample_rate: number
        total_segments: number
        segment_duration: number
      }
      spectrogram: string
    }
  }

  const props = defineProps<Props>()

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const generateLinePath = (history: any) => {
  if (!Array.isArray(history) || history.length < 2) return '';
  const width = 1000;
  const height = 216;
  const step = width / (history.length - 1);
  
  // Ošetrenie číselných hodnôt
  const cleanHistory = history.map(v => typeof v === 'number' ? v : 0);
  const min = Math.min(...cleanHistory, -60);
  const max = Math.max(...cleanHistory, 0);
  const range = max - min || 1;

  return cleanHistory.map((v, i) => {
    const x = i * step;
    const y = 221 - ((v - min) / range) * height;
    return (i === 0 ? 'M' : 'L') + `${x.toFixed(2)},${y.toFixed(2)}`;
  }).join(' ');
};

const generateAreaPath = (history: any) => {
  const line = generateLinePath(history);
  return line ? `${line} L 1000,221 L 0,221 Z` : '';
};

</script>