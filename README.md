## Project Goal

Provide a way to swap tokens between subnet and mainnet.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Contributing to the UI Token List

To add your token to the UI token list, follow these steps:

1. **Approval**: Ensure your token is approved by XDC Zero.

2. **Fork the Repository**: Fork the [XinFinOrg/subswap-frontend](https://github.com/XinFinOrg/subswap-frontend) repository.

3. **Create a Pull Request (PR)**: Add your token information to the following section in the `config.ts` file:

   ```typescript
   {
     name: 'your token name',
     subnetChainId: 'network chainid your token in',
     parentnetChainId: 'your token support parentnet network chainid',
     subnetToken: 'your token subnet token address',
     selectedToken: "", // no need to submit
     logo: 'your token logo url', // it will show in the /public directory
     mode: 1, // 1: only subnet to parentnet, 2: only parentnet to subnet, 3: both way
   }
   ```

4. **Submit the PR**: Once you've made the changes, submit the PR for review and merge.

For detailed steps on how to fork a repository and create a pull request, refer to GitHub's [official documentation](https://docs.github.com/en/github/collaborating-with-issues-and-pull-requests/working-with-forks).

---

### Example

Here's an example of how your token configuration should look:

```typescript
{
  name: 'Example Token',
  subnetChainId: '1234',
  parentnetChainId: '5678',
  subnetToken: '0xExampleTokenAddress',
  selectedToken: "",
  logo: '/vercel.svg',
  mode: 3, // Allows swapping both ways
}
```

After completing these steps, your token will be available for swapping between the subnet and mainnet on the platform.
