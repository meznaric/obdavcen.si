import {
  CalculateIcon,
  Coins02Icon,
  ChartDecreaseIcon,
  CapStraightIcon,
  BankIcon,
} from "hugeicons-react";
import { Button } from "~/ui/common/Button/Button";
import { TreeBreakdown } from "~/ui/common/TreeBreakdown/TreeBreakdown";
import { Card } from "~/ui/common/Card/Card";
import { Input } from "~/ui/common/Input/Input";
import { Slider } from "~/ui/common/Slider/Slider";
import { Tabs } from "~/ui/common/Tabs/Tabs";
import { Text } from "~/ui/common/Text/Text";

export default function StyleguidePage() {
  const tabsData = [
    {
      id: "tab1",
      label: "Tab 1",
      content: <Text>Content for Tab 1</Text>,
    },
    {
      id: "tab2",
      label: "Tab 2",
      content: <Text>Content for Tab 2</Text>,
    },
    {
      id: "tab3",
      label: "Tab 3",
      content: <Text>Content for Tab 3</Text>,
    },
  ];
  return (
    <div className="container mx-auto p-8 space-y-12">
      {/* Header */}
      <div className="border-b pb-4">
        <Text variant="h1">UI Component Styleguide</Text>
        <Text variant="body" className="mt-2">
          A showcase of our common UI components and their variants
        </Text>
      </div>

      {/* Typography Section */}
      <section>
        <Text variant="h2" className="mb-6">
          Typography
        </Text>
        <div className="space-y-4">
          <Text variant="h1">Heading 1</Text>
          <Text variant="h2">Heading 2</Text>
          <Text variant="h3">Heading 3</Text>
          <Text variant="bodyLarge">
            Body Large - Lorem ipsum dolor sit amet
          </Text>
          <Text variant="body">Body - Lorem ipsum dolor sit amet</Text>
          <Text variant="bodySmall">
            Body Small - Lorem ipsum dolor sit amet
          </Text>
          <Text variant="caption">Caption text example</Text>
          <Text variant="label">Label text example</Text>
          <Text variant="error">Error message example</Text>
          <Text variant="link">Link text example</Text>
        </div>
      </section>

      {/* Buttons Section */}
      <section>
        <Text variant="h2" className="mb-6">
          Buttons
        </Text>

        <div className="space-y-6">
          {/* Primary Buttons */}
          <div>
            <Text variant="h3" className="mb-4">
              Primary
            </Text>
            <div className="flex gap-4 flex-wrap">
              <Button variant="primary" size="sm">
                Small
              </Button>
              <Button variant="primary" size="md">
                Medium
              </Button>
              <Button variant="primary" size="lg">
                Large
              </Button>
              <Button variant="primary" disabled>
                Disabled
              </Button>
            </div>
          </div>

          {/* Secondary Buttons */}
          <div>
            <Text variant="h3" className="mb-4">
              Secondary
            </Text>
            <div className="flex gap-4 flex-wrap">
              <Button variant="secondary" size="sm">
                Small
              </Button>
              <Button variant="secondary" size="md">
                Medium
              </Button>
              <Button variant="secondary" size="lg">
                Large
              </Button>
              <Button variant="secondary" disabled>
                Disabled
              </Button>
            </div>
          </div>

          {/* Outline Buttons */}
          <div>
            <Text variant="h3" className="mb-4">
              Outline
            </Text>
            <div className="flex gap-4 flex-wrap">
              <Button variant="outline" size="sm">
                Small
              </Button>
              <Button variant="outline" size="md">
                Medium
              </Button>
              <Button variant="outline" size="lg">
                Large
              </Button>
              <Button variant="outline" disabled>
                Disabled
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Input Section */}
      <section>
        <Text variant="h2" className="mb-6">
          Inputs
        </Text>
        <div className="space-y-4 max-w-md">
          <Input placeholder="Default input" />
          <Input label="Labeled input" placeholder="Type here..." />
          <Input
            label="Input with error"
            placeholder="Type here..."
            error="This field is required"
          />
          <Input
            label="Disabled input"
            disabled
            placeholder="Can't type here"
          />
        </div>
      </section>

      {/* Slider Section */}
      <section>
        <Text variant="h2" className="mb-6">
          Sliders
        </Text>
        <div className="space-y-4 max-w-md">
          <Slider min={0} max={100} defaultValue={50} />
          <Slider label="Labeled Slider" min={0} max={100} defaultValue={75} />
          <Slider
            label="Disabled Slider"
            min={0}
            max={100}
            defaultValue={25}
            disabled
          />
        </div>
      </section>

      {/* Tabs Section */}
      <section>
        <Text variant="h2" className="mb-6">
          Tabs
        </Text>
        <Tabs tabs={tabsData} className="max-w-md" />
      </section>

      {/* Cards Section */}
      <section>
        <Text variant="h2" className="mb-6">
          Cards
        </Text>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <Text variant="h3">Simple Card</Text>
            <Text>Basic card with some content.</Text>
          </Card>

          <Card>
            <Text variant="h3">Card with Actions</Text>
            <Text>Card with some buttons.</Text>
            <div className="card-actions justify-end mt-4">
              <Button variant="primary" size="sm">
                Action
              </Button>
            </div>
          </Card>

          <Card>
            <Text variant="h3">Interactive Card</Text>
            <Input label="Name" placeholder="Enter your name" />
            <Button className="mt-4" variant="primary">
              Submit
            </Button>
          </Card>
        </div>
      </section>

      {/* TreeBreakdown Section */}
      <section>
        <Text variant="h2" className="mb-6">
          Tree Breakdown
        </Text>
        <TreeBreakdown
          items={[
            {
              label: "General Info",
              value: "€120,000",
              icon: <Coins02Icon className="w-5 h-5" />,
              tooltip: "Revenue before expenses",
            },
            {
              label: "Taxes",
              value: "56.000",
              icon: <Coins02Icon className="w-5 h-5" />,
              color: "red",
              tooltip: "Annual Total Taxes",
              children: [
                {
                  label: "Prispevki",
                  value: "€30,000",
                  icon: <CalculateIcon className="w-5 h-5" />,
                  color: "red",
                  children: [
                    {
                      label: "Povprečna osnovna plača (POP)",
                      value: "€2023,92",
                      icon: <CalculateIcon className="w-5 h-5" />,
                    },
                    {
                      label: "Osnova - 60% POP",
                      value: "€1214.92",
                      icon: <CalculateIcon className="w-5 h-5" />,
                    },
                    {
                      label: "Koncni prispevki - 38,20% Osnove",
                      value: "€463,87",
                      icon: <CalculateIcon className="w-5 h-5" />,
                      color: "red",
                    },
                  ],
                },
                {
                  label: "Dohodnina",
                  value: "€30,000",
                  icon: <BankIcon className="w-5 h-5" />,
                  color: "red",
                  children: [
                    {
                      label: "Davčna osnova",
                      value: "€3,412",
                      icon: <CapStraightIcon className="w-5 h-5" />,
                      description: "This is calculated based of my X",
                    },
                    {
                      label: "Do 4000 EUR - 10%",
                      value: "€3,412",
                      icon: <ChartDecreaseIcon className="w-5 h-5" />,
                      color: "red",
                    },
                    {
                      label: "Do 4000 EUR - 20%",
                      value: "€3,412",
                      icon: <ChartDecreaseIcon className="w-5 h-5" />,
                      color: "red",
                    },
                    {
                      label: "Do 4000 EUR - 30%",
                      value: "€3,412",
                      icon: <ChartDecreaseIcon className="w-5 h-5" />,
                      color: "red",
                    },
                    {
                      label: "Do 4000 EUR - 40%",
                      value: "€3,412",
                      icon: <ChartDecreaseIcon className="w-5 h-5" />,
                      color: "red",
                    },
                  ],
                },
              ],
            },
            {
              label: "Total Revenue",
              value: "€120,000",
              icon: <Coins02Icon className="w-5 h-5" />,
              color: "green",
              description: "Tax Efficiency: 43.7%",
              children: [
                {
                  label: "Salary",
                  value: "€120,000",
                  icon: <Coins02Icon className="w-5 h-5" />,
                  color: "green",
                },
                {
                  label: "Dividends",
                  value: "€120,000",
                  icon: <Coins02Icon className="w-5 h-5" />,
                  color: "green",
                },
              ],
            },
          ]}
          className="max-w-2xl"
        />
      </section>
    </div>
  );
}
