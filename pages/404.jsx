import { Layout } from "../layouts/base.jsx";

export default (data) => (
  <Layout {...data} title="Page not found">
    <div class="mx-auto pile">
      <style>
        {`
          .pile {
            display: grid; place-items: center;
          }
          .pile > * {
            grid-area: 1 / 1 / 1 / 1;
          }
          @keyframes spin {
            to {
              transform: rotate(1turn);
            }
          }
          .pile > svg {
            max-width: 100%;
            animation: spin 12s infinite linear;
          }
          .pile > b {
            color: white;
            z-index: 10;
          }
        `}
      </style>
      <svg
        width="500"
        height="500"
        fill="var(--contrast)"
        viewBox="0 0 24 24"
        stroke="var(--contrast)"
        stroke-width="1.25"
        aria-hidden="true"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z"
        />
      </svg>
      <b class="font-7" aria-hidden="true">
        404
      </b>
    </div>
  </Layout>
);
