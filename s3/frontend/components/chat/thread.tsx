"use client"

import {
  ActionBarPrimitive,
  BranchPickerPrimitive,
  ComposerPrimitive,
  MessagePrimitive,
  ThreadPrimitive,
} from "@assistant-ui/react"
import type { FC } from "react"
import {
  ArrowDownIcon,
  CheckIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CopyIcon,
  PencilIcon,
  RefreshCwIcon,
  SendHorizontalIcon,
  SquareIcon,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

export const Thread: FC = () => {
  return (
    <ThreadPrimitive.Root className="bg-background text-foreground flex h-full flex-col overflow-hidden">
      <ThreadPrimitive.Viewport className="flex h-full flex-col items-center overflow-y-scroll scroll-smooth bg-inherit px-4 pt-8">
        <ThreadWelcome />

        <ThreadPrimitive.Messages
          components={{
            UserMessage: UserMessage,
            EditComposer: EditComposer,
            AssistantMessage: AssistantMessage,
          }}
        />

        <ThreadPrimitive.If empty={false}>
          <div className="min-h-8 flex-grow" />
        </ThreadPrimitive.If>

        <div className="sticky bottom-0 mt-3 flex w-full max-w-2xl flex-col items-center justify-end rounded-t-lg bg-inherit pb-4">
          <ThreadScrollToBottom />
          <Composer />
        </div>
      </ThreadPrimitive.Viewport>
    </ThreadPrimitive.Root>
  )
}

const ThreadScrollToBottom: FC = () => {
  return (
    <ThreadPrimitive.ScrollToBottom asChild>
      <Button
        variant="outline"
        size="icon"
        className="absolute -top-8 rounded-full disabled:invisible"
      >
        <ArrowDownIcon className="h-4 w-4" />
      </Button>
    </ThreadPrimitive.ScrollToBottom>
  )
}

const ThreadWelcome: FC = () => {
  return (
    <ThreadPrimitive.Empty>
      <div className="flex w-full max-w-2xl flex-grow flex-col">
        <div className="flex w-full flex-grow flex-col items-center justify-center">
          <h1 className="text-4xl font-bold mb-4">Roberto Allende</h1>
          <p className="text-lg text-muted-foreground mb-8">
            Welcome to my personal website. How can I help you today?
          </p>
        </div>
        <ThreadWelcomeSuggestions />
      </div>
    </ThreadPrimitive.Empty>
  )
}

const ThreadWelcomeSuggestions: FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full max-w-4xl">
      <ThreadPrimitive.Suggestion
        className="hover:bg-muted/80 flex flex-col items-start justify-center rounded-lg border p-4 transition-colors ease-in cursor-pointer"
        prompt="Tell me about yourself"
        method="replace"
        autoSend
      >
        <h3 className="font-semibold mb-2">About</h3>
        <p className="text-sm text-muted-foreground">Learn about my background and experience</p>
      </ThreadPrimitive.Suggestion>
      
      <ThreadPrimitive.Suggestion
        className="hover:bg-muted/80 flex flex-col items-start justify-center rounded-lg border p-4 transition-colors ease-in cursor-pointer"
        prompt="Show me your projects"
        method="replace"
        autoSend
      >
        <h3 className="font-semibold mb-2">Projects</h3>
        <p className="text-sm text-muted-foreground">Explore what I&apos;ve built</p>
      </ThreadPrimitive.Suggestion>
      
      <ThreadPrimitive.Suggestion
        className="hover:bg-muted/80 flex flex-col items-start justify-center rounded-lg border p-4 transition-colors ease-in cursor-pointer"
        prompt="Read my blog posts"
        method="replace"
        autoSend
      >
        <h3 className="font-semibold mb-2">Blog</h3>
        <p className="text-sm text-muted-foreground">My thoughts and insights</p>
      </ThreadPrimitive.Suggestion>
      
      <ThreadPrimitive.Suggestion
        className="hover:bg-muted/80 flex flex-col items-start justify-center rounded-lg border p-4 transition-colors ease-in cursor-pointer"
        prompt="Share some poetry"
        method="replace"
        autoSend
      >
        <h3 className="font-semibold mb-2">Poetry</h3>
        <p className="text-sm text-muted-foreground">Creative writing and verses</p>
      </ThreadPrimitive.Suggestion>
      
      <ThreadPrimitive.Suggestion
        className="hover:bg-muted/80 flex flex-col items-start justify-center rounded-lg border p-4 transition-colors ease-in cursor-pointer"
        prompt="How can I contact you?"
        method="replace"
        autoSend
      >
        <h3 className="font-semibold mb-2">Contact</h3>
        <p className="text-sm text-muted-foreground">Get in touch with me</p>
      </ThreadPrimitive.Suggestion>
    </div>
  )
}

const Composer: FC = () => {
  return (
    <ComposerPrimitive.Root className="focus-within:border-ring/20 flex w-full flex-wrap items-end rounded-lg border bg-inherit px-2.5 shadow-sm transition-colors ease-in">
      <ComposerPrimitive.Input
        rows={1}
        autoFocus
        placeholder="Ask me anything..."
        className="placeholder:text-muted-foreground max-h-40 flex-grow resize-none border-none bg-transparent px-2 py-4 text-sm outline-none focus:ring-0 disabled:cursor-not-allowed"
      />
      <ComposerAction />
    </ComposerPrimitive.Root>
  )
}

const ComposerAction: FC = () => {
  return (
    <>
      <ThreadPrimitive.If running={false}>
        <ComposerPrimitive.Send asChild>
          <Button size="icon" className="my-2.5 size-8 p-2">
            <SendHorizontalIcon className="h-4 w-4" />
          </Button>
        </ComposerPrimitive.Send>
      </ThreadPrimitive.If>
      <ThreadPrimitive.If running>
        <ComposerPrimitive.Cancel asChild>
          <Button size="icon" variant="outline" className="my-2.5 size-8 p-2">
            <SquareIcon className="h-3 w-3" />
          </Button>
        </ComposerPrimitive.Cancel>
      </ThreadPrimitive.If>
    </>
  )
}

const UserMessage: FC = () => {
  return (
    <MessagePrimitive.Root className="grid w-full max-w-2xl auto-rows-auto grid-cols-[minmax(72px,1fr)_auto] gap-y-2 py-4">
      <UserActionBar />
      <div className="bg-muted text-foreground col-start-2 row-start-2 max-w-xl break-words rounded-3xl px-5 py-2.5">
        <MessagePrimitive.Parts />
      </div>
      <BranchPicker className="col-span-full col-start-1 row-start-3 -mr-1 justify-end" />
    </MessagePrimitive.Root>
  )
}

const UserActionBar: FC = () => {
  return (
    <ActionBarPrimitive.Root
      hideWhenRunning
      autohide="not-last"
      className="col-start-1 row-start-2 mr-3 mt-2.5 flex flex-col items-end"
    >
      <ActionBarPrimitive.Edit asChild>
        <Button size="icon" variant="ghost" className="h-8 w-8">
          <PencilIcon className="h-4 w-4" />
        </Button>
      </ActionBarPrimitive.Edit>
    </ActionBarPrimitive.Root>
  )
}

const EditComposer: FC = () => {
  return (
    <ComposerPrimitive.Root className="bg-muted my-4 flex w-full max-w-2xl flex-col gap-2 rounded-xl">
      <ComposerPrimitive.Input className="text-foreground flex h-8 w-full resize-none bg-transparent p-4 pb-0 outline-none" />
      <div className="mx-3 mb-3 flex items-center justify-center gap-2 self-end">
        <ComposerPrimitive.Cancel asChild>
          <Button variant="ghost">Cancel</Button>
        </ComposerPrimitive.Cancel>
        <ComposerPrimitive.Send asChild>
          <Button>Send</Button>
        </ComposerPrimitive.Send>
      </div>
    </ComposerPrimitive.Root>
  )
}

const AssistantMessage: FC = () => {
  return (
    <MessagePrimitive.Root className="relative grid w-full max-w-2xl grid-cols-[auto_auto_1fr] grid-rows-[auto_1fr] py-4">
      <div className="text-foreground col-span-2 col-start-2 row-start-1 my-1.5 max-w-xl break-words leading-7 font-mono">
        <MessagePrimitive.Parts />
      </div>
      <AssistantActionBar />
      <BranchPicker className="col-start-2 row-start-2 -ml-2 mr-2" />
    </MessagePrimitive.Root>
  )
}

const AssistantActionBar: FC = () => {
  return (
    <ActionBarPrimitive.Root
      hideWhenRunning
      autohide="not-last"
      autohideFloat="single-branch"
      className="text-muted-foreground data-[floating]:bg-background col-start-3 row-start-2 -ml-1 flex gap-1 data-[floating]:absolute data-[floating]:rounded-md data-[floating]:border data-[floating]:p-1 data-[floating]:shadow-sm"
    >
      <ActionBarPrimitive.Copy asChild>
        <Button size="icon" variant="ghost" className="h-8 w-8">
          <MessagePrimitive.If copied>
            <CheckIcon className="h-4 w-4" />
          </MessagePrimitive.If>
          <MessagePrimitive.If copied={false}>
            <CopyIcon className="h-4 w-4" />
          </MessagePrimitive.If>
        </Button>
      </ActionBarPrimitive.Copy>
      <ActionBarPrimitive.Reload asChild>
        <Button size="icon" variant="ghost" className="h-8 w-8">
          <RefreshCwIcon className="h-4 w-4" />
        </Button>
      </ActionBarPrimitive.Reload>
    </ActionBarPrimitive.Root>
  )
}

const BranchPicker: FC<BranchPickerPrimitive.Root.Props> = ({
  className,
  ...rest
}) => {
  return (
    <BranchPickerPrimitive.Root
      hideWhenSingleBranch
      className={cn(
        "text-muted-foreground inline-flex items-center text-xs",
        className,
      )}
      {...rest}
    >
      <BranchPickerPrimitive.Previous asChild>
        <Button size="icon" variant="ghost" className="h-6 w-6">
          <ChevronLeftIcon className="h-3 w-3" />
        </Button>
      </BranchPickerPrimitive.Previous>
      <span className="font-medium px-2">
        <BranchPickerPrimitive.Number /> / <BranchPickerPrimitive.Count />
      </span>
      <BranchPickerPrimitive.Next asChild>
        <Button size="icon" variant="ghost" className="h-6 w-6">
          <ChevronRightIcon className="h-3 w-3" />
        </Button>
      </BranchPickerPrimitive.Next>
    </BranchPickerPrimitive.Root>
  )
}
